import { Router } from 'express';
import * as ctrl from '../controllers/foodController.js';

const router = Router();

router.post('/', ctrl.addFood);
router.get('/', ctrl.getFoodLogs);
router.delete('/:id', ctrl.deleteFoodLog);

export default router;
