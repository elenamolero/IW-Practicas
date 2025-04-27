import { Router } from 'express';
import { 
  createWorkout, 
  getUserWorkouts, 
  getWorkoutById, 
  updateWorkout, 
  deleteWorkout 
} from '../controllers/workout.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createWorkoutSchema, updateWorkoutSchema } from '../Schemas/workout.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

// Crear un nuevo workout
router.post(
  '/create-workout',
  authRequired,
  requireRole(['trainer', 'member']), 
  validateSchema(createWorkoutSchema),
  createWorkout
);

// Obtener todos los workouts del usuario
router.get(
  '/my-workouts',
  authRequired,
  requireRole(['member']),
  getUserWorkouts
);

// Obtener un workout específico
router.get(
  '/workouts/:workoutId',
  authRequired,
  requireRole(['member']),
  getWorkoutById
);

// Actualizar un workout
router.put(
  '/workouts/:workoutId',
  authRequired,
  requireRole(['member']),
  validateSchema(updateWorkoutSchema),
  updateWorkout
);

// Eliminar un workout
router.delete(
  '/workouts/:workoutId',
  authRequired,
  requireRole(['member']),
  deleteWorkout
);

export default router;
