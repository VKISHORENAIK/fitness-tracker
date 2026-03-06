import { Router } from 'express';
import { searchFoods, calculateNutrition } from '../controllers/foodsLookupController.js';

const router = Router();

router.get('/search', searchFoods);
router.get('/calculate', calculateNutrition);

export default router;
