import {Router} from 'express';
import {login,register,logout,profile,verifyToken, updateUser, getUserByEmail, deleteUser} from "../controllers/auth.controller.js";
import { authRequired } from '../Middlewares/validateToken.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';
import { registerSchema,loginSchema, updateSchema, getUserByEmailSchema, deleteUserSchema } from '../Schemas/auth.schema.js';

const router =Router();

router.post(
    '/register',
    authRequired,
    requireRole(['entrenador', 'socio']), //el admin padre puede crear nuevos entrenadores y los socios se pueden registrar solos
    validateSchema(registerSchema),
    register);
router.put(
    '/update',
    authRequired,
    requireRole(['entrenador', 'socio']), 
    validateSchema(updateSchema),
    updateUser);
router.get(
    '/get-user-by-email/:email', 
    authRequired,
    requireRole(['entrenador', 'socio']), 
    validateSchema(getUserByEmailSchema, 'params'), 
    getUserByEmail);
router.delete(
    '/delete-user/:email',
    authRequired,
    requireRole(['entrenador', 'socio']), // el socio puede cancelar la suscripción y el entrenador puede eliminar a los demás usuarios
    validateSchema(deleteUserSchema, 'params'),
    deleteUser
  );
router.post(
    '/login',
    authRequired,
    requireRole(['entrenador', 'socio']),
    validateSchema(loginSchema),
    login);
router.post('/logout',logout);
router.get('/profile',verifyToken);
router.get('/verify',authRequired,profile);


//agregar a express 
export default router