import { Router } from 'express';
import { 
  createMuscleRoomReserve, 
  getUserReserves, 
  getReserveById, 
  updateReserve, 
  cancelReserve,
  countCurrentReservationsByRoom
} from '../controllers/muscleRoomReserve.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createMuscleRoomReserveSchema, updateMuscleRoomReserveSchema } from '../Schemas/muscleRoomReserve.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

// Crear una nueva reserva de sala de musculación
router.post(
  '/create-muscle-room-reserve',
  authRequired,
  requireRole(['member']), // Solo los socios pueden hacer reservas
  validateSchema(createMuscleRoomReserveSchema),
  createMuscleRoomReserve
);

router.get(
  '/muscle-room/:muscleRoomId/current-reservations',
  authRequired,
  countCurrentReservationsByRoom
);


// Obtener todas las reservas del usuario
router.get(
  '/my-muscle-room-reserves',
  authRequired,
  getUserReserves
);

// Obtener una reserva específica
router.get(
  '/muscle-room-reserves/:reserveId',
  authRequired,
  getReserveById
);

// Actualizar una reserva
router.put(
  '/muscle-room-reserves/:reserveId',
  authRequired,
  validateSchema(updateMuscleRoomReserveSchema),
  updateReserve
);

// Cancelar una reserva
router.delete(
  '/muscle-room-reserves/:reserveId',
  authRequired,
  cancelReserve
);

export default router; 