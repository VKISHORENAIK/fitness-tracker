import prisma from '../lib/prisma.js';
import { getUserId } from '../middleware/user.js';

export async function addFood(req, res) {
  try {
    const userId = getUserId(req);
    const { foodName, quantity, unit, calories, protein, date } = req.body;

    const totalCalories = Number(calories) || 0;
    const totalProtein = Number(protein) || 0;

    const log = await prisma.foodLog.create({
      data: {
        userId,
        foodName,
        quantity: Number(quantity) || 1,
        unit: unit || 'g',
        calories: totalCalories,
        protein: totalProtein,
        date: date ? new Date(date) : new Date(),
      },
    });
    res.status(201).json(log);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to add food' });
  }
}

export async function getFoodLogs(req, res) {
  try {
    const userId = getUserId(req);
    const { from, to } = req.query;

    const where = { userId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const logs = await prisma.foodLog.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch food logs' });
  }
}

export async function deleteFoodLog(req, res) {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    await prisma.foodLog.deleteMany({ where: { id, userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to delete food log' });
  }
}
