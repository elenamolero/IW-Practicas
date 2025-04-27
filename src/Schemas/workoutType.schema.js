import { z } from 'zod';

export const createWorkoutTypeSchema = z.object({
  title: z.string({
    required_error: "El título es requerido",
  }).min(1, "El título no puede estar vacío"),
  description: z.string().optional(),
});

export const updateWorkoutTypeSchema = z.object({
  title: z.string().min(1, "El título no puede estar vacío").optional(),
  description: z.string().optional(),
}); 