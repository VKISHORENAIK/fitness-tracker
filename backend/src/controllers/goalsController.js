import prisma from '../lib/prisma.js';
import { getUserId } from '../middleware/user.js';

export async function getGoals(req, res) {
  try {
    const userId = getUserId(req);
    const goal = await prisma.nutritionGoal.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(goal || { dailyCalories: 2000, dailyProtein: 150 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch goals' });
  }
}

export async function updateGoals(req, res) {
  try {
    const userId = getUserId(req);
    const { dailyCalories, dailyProtein } = req.body;

    const goal = await prisma.nutritionGoal.create({
      data: {
        userId,
        dailyCalories: Number(dailyCalories) ?? 2000,
        dailyProtein: Number(dailyProtein) ?? 150,
      },
    });
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to update goals' });
  }
}
