import { Router } from 'express';
import * as ctrl from '../controllers/workoutsController.js';

const router = Router();

router.post('/', ctrl.addWorkout);
router.get('/', ctrl.getWorkouts);
router.delete('/:id', ctrl.deleteWorkout);

export default router;
