import { Router } from 'express';
import { 
  createWorkoutType, 
  getUserWorkoutTypes, 
  getWorkoutTypeById, 
  updateWorkoutType, 
  deleteWorkoutType 
} from '../controllers/workoutType.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createWorkoutTypeSchema, updateWorkoutTypeSchema } from '../Schemas/workoutType.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

// Crear un nuevo tipo de workout
router.post(
  '/create-workout-type',
  authRequired,
  requireRole(['member']),
  validateSchema(createWorkoutTypeSchema),
  createWorkoutType
);

// Obtener todos los tipos de workout del usuario
router.get(
  '/my-workout-types',
  authRequired,
  requireRole(['member']),
  getUserWorkoutTypes
);

// Obtener un tipo de workout específico
router.get(
  '/workout-types/:workoutTypeId',
  authRequired,
  requireRole(['member']),
  getWorkoutTypeById
);

// Actualizar un tipo de workout
router.put(
  '/workout-types/:workoutTypeId',
  authRequired,
  requireRole(['member']),
  validateSchema(updateWorkoutTypeSchema),
  updateWorkoutType
);

// Eliminar un tipo de workout
router.delete(
  '/workout-types/:workoutTypeId',
  authRequired,
  requireRole(['member']),
  deleteWorkoutType
);

export default router; 