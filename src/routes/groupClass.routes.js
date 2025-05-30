import { Router } from 'express';
import { 
  createGroupClass, 
  cancelGroupClass, 
  updateGroupClass, 
  getGroupClassDetails, 
  reserveGroupClass, 
  deleteGroupClass, 
  getGroupClassSchedule ,
  getGroupClassesByDate,
  cancelGroupClassReservation,
  getMyUpcomingGroupClasses,
  getMyUpcomingTrainerClasses
} from '../controllers/groupClass.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createClassSchema, updateClassSchema } from '../Schemas/groupClass.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

router.post(
  '/create-group-class',
  authRequired,
  requireRole(['trainer']), // only trainers can create classes
  validateSchema(createClassSchema),
  createGroupClass
);

router.delete(
  '/cancel-group-class/:classId',
  authRequired,
  requireRole(['trainer']), // only trainers can cancel classes
  cancelGroupClass
);

router.put(
  '/update-group-class/:classId',
  authRequired,
  requireRole(['trainer']), // only trainers can update classes
  validateSchema(updateClassSchema),
  updateGroupClass
);

router.get(
  '/group-class-details/:classId',
  authRequired,
  getGroupClassDetails
);

router.post(
  '/reserve-group-class/:classId',
  authRequired, // cualquier usuario logueado puede reservar
  reserveGroupClass
);

router.delete(
  '/delete-group-class/:classId',
  authRequired,
  requireRole(['trainer']), 
  deleteGroupClass
);

// Obtener horario de clases (opcionalmente por fecha)
router.get(
  '/group-class-schedule',
  getGroupClassSchedule // No requiere auth, o puedes poner authRequired si quieres protegerlo
);

router.get(
  '/my-classes-by-day/:date',
  authRequired,
  requireRole(['trainer', 'member']),
  getGroupClassesByDate
);

// PATCH porque modificas parcialmente la clase grupal
router.patch('/group-classes-cancel-reservation/:classId', 
  authRequired, 
  requireRole(['trainer', 'member']),
  
  cancelGroupClassReservation
);

router.get(
  "/my-upcoming-group-classes",
  authRequired,
  getMyUpcomingGroupClasses
);

router.get(
  '/my-upcoming-trainer-classes',
  authRequired,
  requireRole(['trainer']),  // solo entrenadores
  getMyUpcomingTrainerClasses
);

export default router;
