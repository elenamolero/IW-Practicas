import { z } from 'zod';

export const createWorkoutSchema = z.object({
  workoutTypeId: z.string({
    required_error: 'WorkoutTypeId is required',
  }),
  
  date: z.string({
    required_error: 'Workout date is required',
  }),

  series: z.number({
    required_error: 'Number of series is required',
  }).min(1, {
    message: 'Series must be at least 1',
  }),

  repetitions: z.number({
    required_error: 'Number of repetitions is required',
  }).min(1, {
    message: 'Repetitions must be at least 1',
  }),

  rest: z.number({
    required_error: 'Rest time is required',
  }).min(0, {
    message: 'Rest time cannot be negative',
  }),

  order: z.number({
    required_error: 'Order is required',
  }).min(1, {
    message: 'Order must be at least 1',
  }),

  weigh: z.number({
    required_error: 'weigh is required',
  }).min(1, {
    message: 'weigh must be at least 1',
  }),

  intensity: z.number({
    required_error: 'Intensity level is required',
  })
});

export const updateWorkoutSchema = z.object({
  workoutTypeId: z.string().optional(),
  
  date: z.string().optional(),

  series: z.number().min(1, {
    message: 'Series must be at least 1',
  }).optional(),

  repetitions: z.number().min(1, {
    message: 'Repetitions must be at least 1',
  }).optional(),

  rest: z.number().min(0, {
    message: 'Rest time cannot be negative',
  }).optional(),

  order: z.number().min(1, {
    message: 'Order must be at least 1',
  }).optional(),

  weigh: z.number().min(1, {
    message: 'Intensity must be at least 1',
  }).max(10, {
    message: 'Intensity cannot exceed 10',
  }).optional(),
});

export default createWorkoutSchema;
