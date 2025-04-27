import { z } from 'zod';

export const createPaySchema = z.object({
  amount: z.number({
    required_error: 'El monto es requerido',
  }).min(0, {
    message: 'El monto debe ser mayor o igual a 0',
  }),

  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'cash'], {
    required_error: 'El método de pago es requerido',
  }),

  description: z.string({
    required_error: 'La descripción es requerida',
  }),

  transactionId: z.string().optional(),

  dueDate: z.string({
    required_error: 'La fecha de vencimiento es requerida',
  }),

  relatedService: z.enum(['membership', 'class', 'personal_training', 'other'], {
    required_error: 'El servicio relacionado es requerido',
  }),

  relatedServiceId: z.string().optional(),
});

export const updatePaySchema = z.object({
  amount: z.number().min(0).optional(),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'cash']).optional(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  description: z.string().optional(),
  transactionId: z.string().optional(),
  dueDate: z.string().optional(),
  relatedService: z.enum(['membership', 'class', 'personal_training', 'other']).optional(),
  relatedServiceId: z.string().optional(),
}); 