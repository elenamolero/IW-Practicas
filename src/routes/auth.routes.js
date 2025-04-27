import {Router} from 'express';
import {login,register,logout,profile,verifyToken, updateUser, getUserByEmail, deleteUser} from "../controllers/auth.controller.js";
import { authRequired } from '../Middlewares/validateToken.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';
import { registerSchema,loginSchema, updateSchema, getUserByEmailSchema, deleteUserSchema } from '../Schemas/auth.schema.js';

const router =Router();


router.post(
    '/register',
    validateSchema(registerSchema),
    register);
router.put(
    '/update',
    authRequired,
    requireRole(['trainer', 'member']), 
    validateSchema(updateSchema),
    updateUser);
router.get(
    '/get-user-by-email/:email', 
    authRequired,
    requireRole(['trainer', 'member']), 
    validateSchema(getUserByEmailSchema, 'params'), 
    getUserByEmail);
router.delete(
    '/delete-user/:email',
    //authRequired,
    //requireRole(['trainer', 'member']), // el member puede cancelar la suscripción y el trainer puede eliminar a los demás usuarios
    //validateSchema(deleteUserSchema, 'params'),
    deleteUser
  );
router.post(
    '/login',
    //validateSchema(loginSchema),
    login);
router.post('/logout',logout);
router.get('/profile',verifyToken);
router.get('/verify',authRequired,profile);


//agregar a express 
export default router