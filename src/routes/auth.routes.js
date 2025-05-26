import {Router} from 'express';
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  updateUser,
  getUserByEmail,
  deleteUser,
  getAllMembers,
  getMemberWorkoutsByDate,
  getAllTrainers,
  updateUserMember,
  getMemberById,
  registerTrainerAsAdmin
} from "../controllers/auth.controller.js";
import { authRequired } from '../Middlewares/validateToken.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';
import upload from '../Middlewares/upload.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateSchema,
  getUserByEmailSchema,
  deleteUserSchema
} from '../Schemas/auth.schema.js';

const router = Router();

router.post(
  '/register',
  upload.single('photo'),
  validateSchema(registerSchema),
  register
);
router.post(
  "/register-trainer",
  authRequired,
  requireRole(["trainer"]),
  validateSchema(registerSchema),
  registerTrainerAsAdmin
);

router.post(
  '/login',
  validateSchema(loginSchema),
  login
);

router.post('/logout', logout);

router.get('/profile', verifyToken);
router.get('/verify', authRequired, profile);

router.put(
  '/update',
  authRequired,
  requireRole(['trainer', 'member']),
  validateSchema(updateSchema),
  updateUser
);

router.get(
  '/get-user-by-email/:email',
  authRequired,
  requireRole(['trainer']),
  validateSchema(getUserByEmailSchema, 'params'),
  getUserByEmail
);

router.delete(
  '/delete-user/:email',
  authRequired,
  requireRole(['trainer']),
  validateSchema(deleteUserSchema, 'params'),
  deleteUser
);

router.get(
  '/members',
  authRequired,
  requireRole(['trainer']),
  getAllMembers
);

router.get(
  '/trainers',
  authRequired,
  requireRole(['trainer']),
  getAllTrainers
);

router.get(
  '/member-workouts/:memberId',
  authRequired,
  requireRole(['trainer']),
  getMemberWorkoutsByDate
);

router.put(
'/update-member/:id',
authRequired,
requireRole(['trainer']),
validateSchema(updateSchema),
updateUserMember
);

router.get(
  '/member/:id',
  authRequired,
  requireRole(['trainer']),
  getMemberById
);
export default router;
