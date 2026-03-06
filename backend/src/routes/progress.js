import { Router } from 'express';
import * as ctrl from '../controllers/progressController.js';

const router = Router();

router.get('/daily', ctrl.getDailyProgress);
router.get('/weekly', ctrl.getWeeklyStats);

export default router;
