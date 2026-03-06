import { Router } from 'express';
import * as ctrl from '../controllers/calorieController.js';

const router = Router();

router.post('/calculate', ctrl.calculateCalories);
router.get('/goals', ctrl.getCalorieGoals);

export default router;
