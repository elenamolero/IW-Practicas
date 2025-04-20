import { Router } from 'express';
import { createGroupClass } from '../controllers/groupClass.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { createClassSchema } from '../Schemas/groupClass.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

router.post(
  '/create-group-class',
  authRequired,
  requireRole(['entrenador']), // only trainers can create classes
  validateSchema(createClassSchema),
  createGroupClass
);

export default router;
