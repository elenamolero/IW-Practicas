import { Router } from 'express';
import { 
  generateMonthlyInvoice, 
  getUserInvoices, 
  getInvoiceById 
} from '../controllers/invoice.controller.js';
import { validateSchema } from '../Middlewares/validator.middleware.js';
import { generateInvoiceSchema } from '../Schemas/invoice.schema.js';
import { authRequired } from '../Middlewares/validateToken.js';
import { requireRole } from '../Middlewares/requireRole.middleware.js';

const router = Router();

// Generar factura mensual
router.post(
  '/generate-monthly',
  authRequired,
  requireRole(['member']), // Solo los socios pueden generar facturas
  validateSchema(generateInvoiceSchema),
  generateMonthlyInvoice
);

// Obtener todas las facturas del usuario
router.get(
  '/my-invoices',
  authRequired,
  requireRole(['member']), // Solo los socios pueden ver sus facturas
  getUserInvoices
);

// Obtener una factura específica
router.get(
  '/invoice/:invoiceId',
  authRequired,
  requireRole(['member']), // Solo los socios pueden ver sus facturas
  getInvoiceById
);

export default router; 