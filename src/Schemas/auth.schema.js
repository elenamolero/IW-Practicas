import { z } from 'zod';

export const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().optional(),
  role: z.enum(['member', 'trainer']).optional(),

  // Campos específicos para members
  bankAccount: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
 
  // Campos específicos para traineres
  classesCanTeach: z.array(z.string()).optional()
}).superRefine((data, ctx) => {
  if (data.role === 'member') {
    if (!data.bankAccount) {
      ctx.addIssue({
        path: ['bankAccount'],
        message: 'La cuenta bancaria es requerida para members',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.weight !== 'number') {
      ctx.addIssue({
        path: ['weight'],
        message: 'El peso es requerido para members',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.height !== 'number') {
      ctx.addIssue({
        path: ['height'],
        message: 'La altura es requerida para members',
        code: z.ZodIssueCode.custom
      });
    }
  }
});

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


  role: z.enum(['member', 'trainer'], {
    required_error: 'El rol es requerido',
  }),

  // Solo para members
  bankAccount: z.string().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),

  // Solo para traineres
  classesCanTeach: z.array(z.string()).optional()
  
}).superRefine((data, ctx) => {
  if (data.role === 'member') {
    if (!data.bankAccount) {
      ctx.addIssue({
        path: ['bankAccount'],
        message: 'La cuenta bancaria es requerida para members',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.weight !== 'number') {
      ctx.addIssue({
        path: ['weight'],
        message: 'El peso es requerido para members',
        code: z.ZodIssueCode.custom
      });
    }
    if (typeof data.height !== 'number') {
      ctx.addIssue({
        path: ['height'],
        message: 'La altura es requerida para members',
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

export const getUserByEmailSchema = z.object({
  email: z.string().email({ message: 'Email inválido' })
});

export const deleteUserSchema = z.object({
  email: z.string().email({ message: "Email inválido" })
});