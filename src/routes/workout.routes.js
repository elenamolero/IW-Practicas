import { Router } from 'express';
import { createWorkout } from '../controllers/workout.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import {createWorkoutSchema} from '../Schemas/workout.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

router.post(
  '/create-workout',
  authRequired,
  requireRole(['trainer', 'member']), 
  validateSchema(createWorkoutSchema),
  createWorkout
);

export default router;
