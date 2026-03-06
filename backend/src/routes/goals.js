import { Router } from 'express';
import * as ctrl from '../controllers/goalsController.js';

const router = Router();

router.get('/', ctrl.getGoals);
router.post('/', ctrl.updateGoals);
router.put('/', ctrl.updateGoals);

export default router;
