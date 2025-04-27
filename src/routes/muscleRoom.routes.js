import { Router } from "express";
import { createMuscleRoom, getAllMuscleRooms, getMuscleRoomById, updateMuscleRoom, deleteMuscleRoom } from "../controllers/muscleRoom.controller.js";
import { validateSchema } from "../Middlewares/validator.middleware.js";
import { createMuscleRoomSchema, updateMuscleRoomSchema } from "../Schemas/muscleRoom.schema.js";
import { authRequired } from "../Middlewares/validateToken.js";
import { requireRole } from "../Middlewares/requireRole.middleware.js";

const router = Router();

// Crear una nueva sala de musculación
router.post(
  '/create-muscle-room',
  authRequired,
  requireRole(['trainer']), // Solo los entrenadores pueden crear salas
  validateSchema(createMuscleRoomSchema),
  createMuscleRoom
);

// Obtener todas las salas de musculación
router.get(
  '/muscle-rooms',
  authRequired,
  getAllMuscleRooms
);

// Obtener una sala de musculación específica
router.get(
  '/muscle-rooms/:roomId',
  authRequired,
  getMuscleRoomById
);

// Actualizar una sala de musculación
router.put(
  '/muscle-rooms/:roomId',
  authRequired,
  requireRole(['trainer']), // Solo los entrenadores pueden actualizar salas
  validateSchema(updateMuscleRoomSchema),
  updateMuscleRoom
);

// Eliminar una sala de musculación
router.delete(
  '/muscle-rooms/:roomId',
  authRequired,
  requireRole(['trainer']), // Solo los entrenadores pueden eliminar salas
  deleteMuscleRoom
);

export default router; 