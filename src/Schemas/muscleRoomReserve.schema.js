import { z } from 'zod';

export const createMuscleRoomReserveSchema = z.object({
  muscleRoom: z.string({
    required_error: 'El ID de la sala es requerido',
  }),

  date: z.string({
    required_error: 'La fecha es requerida',
  }),

  startTime: z.string({
    required_error: 'La hora de inicio es requerida',
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'El formato de hora debe ser HH:MM',
  }),

  endTime: z.string({
    required_error: 'La hora de fin es requerida',
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'El formato de hora debe ser HH:MM',
  }),

  numberOfPeople: z.number({
    required_error: 'El número de personas es requerido',
  }).min(1, {
    message: 'El número de personas debe ser al menos 1',
  }),

  notes: z.string().optional(),
}).refine((data) => {
  // Validar que la hora de fin sea posterior a la hora de inicio
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  return endMinutes > startMinutes;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["endTime"],
});

export const updateMuscleRoomReserveSchema = z.object({
  date: z.string().optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'El formato de hora debe ser HH:MM',
  }).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'El formato de hora debe ser HH:MM',
  }).optional(),
  numberOfPeople: z.number().min(1).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Solo validar si ambas horas están presentes
  if (data.startTime && data.endTime) {
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return endMinutes > startMinutes;
  }
  return true;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["endTime"],
}); 