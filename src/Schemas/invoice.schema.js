import { z } from 'zod';

export const generateInvoiceSchema = z.object({
  month: z.number({
    required_error: 'El mes es requerido',
  }).min(1, {
    message: 'El mes debe estar entre 1 y 12',
  }).max(12, {
    message: 'El mes debe estar entre 1 y 12',
  }),

  year: z.number({
    required_error: 'El año es requerido',
  }).min(2000, {
    message: 'El año debe ser válido',
  }).max(2100, {
    message: 'El año debe ser válido',
  }),

  // Datos opcionales del destinatario que pueden sobrescribir los datos del usuario
  recipientTaxId: z.string().optional(),
  recipientAddress: z.string().optional(),
  
  // Método de pago
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'cash'], {
    required_error: 'El método de pago es requerido',
  }),
});

// Esquema para actualizar una factura
export const updateInvoiceSchema = z.object({
  status: z.enum(['draft', 'issued', 'paid', 'cancelled']).optional(),
  payment: z.string().optional(), // ID del pago asociado
}); 