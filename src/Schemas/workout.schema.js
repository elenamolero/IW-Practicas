import { z } from 'zod';

export const createWorkoutSchema = z.object({
  title: z.string({
    required_error: 'Workout title is required',
  }),

  user_id: z.string({
    required_error: 'User ID is required',
  }),

  description: z.string().optional(), // Description is optional
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

  intensity: z.number({
    required_error: 'Intensity level is required',
  }).min(1, {
    message: 'Intensity must be at least 1',
  }).max(10, {
    message: 'Intensity cannot exceed 10',
  }),
});

export default createWorkoutSchema;
