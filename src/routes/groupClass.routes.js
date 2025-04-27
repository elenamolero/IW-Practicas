import { Router } from 'express';
import { createGroupClass, cancelGroupClass, updateGroupClass } from '../controllers/groupClass.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createClassSchema, updateClassSchema } from '../Schemas/groupClass.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

router.post(
  '/create-group-class',
  //authRequired,
  //requireRole(['trainer']), // only trainers can create classes
  //validateSchema(createClassSchema),
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

export default router;
