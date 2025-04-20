import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string({
    required_error: 'Class name is required',
  }),

  schedule: z.string({
    required_error: 'Schedule is required',
  }),

  maxCapacity: z.number({
    required_error: 'Maximum capacity is required',
  }).min(1, {
    message: 'Capacity must be at least 1 person',
  }),

  assignedTrainer: z.string({
    required_error: 'Assigned trainer ID is required',
  }),

  difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Difficulty level must be selected',
  }),

  attendees: z.array(z.string()).optional(), // Array of user IDs (optional when creating)
});
