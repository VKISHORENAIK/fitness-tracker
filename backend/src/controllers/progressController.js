import prisma from '../lib/prisma.js';
import { getUserId } from '../middleware/user.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function getDailyProgress(req, res) {
  try {
    const userId = getUserId(req);
    const dateParam = req.query.date;
    const date = dateParam ? new Date(dateParam) : new Date();
    const start = startOfDay(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [foodLogs, goalsRow, workouts] = await Promise.all([
      prisma.foodLog.findMany({
        where: { userId, date: { gte: start, lt: end } },
      }),
      prisma.nutritionGoal.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workout.findMany({
        where: { userId, date: { gte: start, lt: end } },
        include: { exercises: true },
      }),
    ]);

    const totalCalories = foodLogs.reduce((s, f) => s + f.calories, 0);
    const totalProtein = foodLogs.reduce((s, f) => s + f.protein, 0);
    const dailyCalories = goalsRow?.dailyCalories ?? 2000;
    const dailyProtein = goalsRow?.dailyProtein ?? 150;

    res.json({
      date: start.toISOString().slice(0, 10),
      caloriesConsumed: Math.round(totalCalories * 10) / 10,
      remainingCalories: Math.max(0, dailyCalories - totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      remainingProtein: Math.max(0, dailyProtein - totalProtein),
      dailyCalorieGoal: dailyCalories,
      dailyProteinGoal: dailyProtein,
      workouts,
      foodLogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch daily progress' });
  }
}

export async function getWeeklyStats(req, res) {
  try {
    const userId = getUserId(req);
    const days = 7;
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const foodLogs = await prisma.foodLog.findMany({
      where: { userId, date: { gte: start } },
    });
    const workouts = await prisma.workout.findMany({
      where: { userId, date: { gte: start } },
      include: { exercises: true },
    });

    const byDay = {};
    for (let i = 0; i <= days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      byDay[key] = { date: key, calories: 0, protein: 0, workoutCount: 0 };
    }

    foodLogs.forEach((f) => {
      const key = f.date.toISOString().slice(0, 10);
      if (byDay[key]) {
        byDay[key].calories += f.calories;
        byDay[key].protein += f.protein;
      }
    });
    workouts.forEach((w) => {
      const key = w.date.toISOString().slice(0, 10);
      if (byDay[key]) byDay[key].workoutCount += 1;
    });

    const weeklyData = Object.keys(byDay)
      .sort()
      .map((k) => ({
        ...byDay[k],
        calories: Math.round(byDay[k].calories * 10) / 10,
        protein: Math.round(byDay[k].protein * 10) / 10,
      }));

    res.json({ weeklyData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch weekly stats' });
  }
}
