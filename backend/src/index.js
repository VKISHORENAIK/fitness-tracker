import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import workoutRoutes from './routes/workouts.js';
import foodRoutes from './routes/food.js';
import progressRoutes from './routes/progress.js';
import goalsRoutes from './routes/goals.js';
import foodsLookupRoutes from './routes/foodsLookup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// API routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/foods-lookup', foodsLookupRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'FitTrack API is running' });
});

app.listen(PORT, () => {
  console.log(`FitTrack API running on http://localhost:${PORT}`);
});
