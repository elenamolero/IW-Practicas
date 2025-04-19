import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({
    required_error: 'Email es requerido',
  }).email({
    message: 'Email inválido',
  }),

  password: z.string({
    required_error: 'Contraseña es requerida',
  }).min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  }),

  firstName: z.string({
    required_error: 'El nombre es requerido',
  }),

  lastName: z.string({
    required_error: 'El apellido es requerido',
  }),

  phone: z.string().optional(),

  photo: z.string().optional(),

  role: z.enum(['socio', 'entrenador'], {
    required_error: 'El rol es requerido',
  }),

  // Solo para socios
  bankAccount: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),

  // Solo para entrenadores
  classesCanTeach: z.array(z.string()).optional()
}).superRefine((data, ctx) => {
  if (data.role === 'socio') {
    if (!data.bankAccount) {
      ctx.addIssue({
        path: ['bankAccount'],
        message: 'La cuenta bancaria es requerida para socios',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.weight !== 'number') {
      ctx.addIssue({
        path: ['weight'],
        message: 'El peso es requerido para socios',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.height !== 'number') {
      ctx.addIssue({
        path: ['height'],
        message: 'La altura es requerida para socios',
        code: z.ZodIssueCode.custom
      });
    }
  }

  if (data.role === 'entrenador') {
    if (!data.classesCanTeach || data.classesCanTeach.length === 0) {
      ctx.addIssue({
        path: ['classesCanTeach'],
        message: 'Debe indicar al menos una clase que puede impartir el entrenador',
        code: z.ZodIssueCode.custom
      });
    }
  }
});

export const loginSchema = z.object({
  email: z.string({
    required_error: 'Email requerido',
  }).email({
    message: 'Email inválido',
  }),

  password: z.string({
    required_error: 'Contraseña requerida',
  }).min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  }),
});

