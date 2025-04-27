import { z } from 'zod';

export const createMuscleRoomSchema = z.object({
  name: z.string({
    required_error: 'El nombre de la sala es requerido',
  }),

  capacity: z.number({
    required_error: 'La capacidad es requerida',
  }).min(1, {
    message: 'La capacidad debe ser al menos 1 persona',
  }),

  description: z.string().optional(),

  equipment: z.array(z.string()).optional(),

  status: z.enum(['available', 'maintenance', 'reserved']).optional(),
});

export const updateMuscleRoomSchema = z.object({
  name: z.string().optional(),
  capacity: z.number().min(1).optional(),
  description: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  status: z.enum(['available', 'maintenance', 'reserved']).optional(),
}); 