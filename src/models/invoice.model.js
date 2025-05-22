import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  // Número y serie de la factura (único y ordenado)
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Fecha de emisión
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Período de la factura (mes y año)
  period: {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    }
  },
  
  // Datos del emisor (gimnasio)
  issuer: {
    businessName: {
      type: String,
      required: true,
      default: "Gimnasio XYZ"
    },
    taxId: {
      type: String,
      required: true,
      default: "B12345678"
    },
    address: {
      type: String,
      required: true,
      default: "Calle Principal 123, 28001 Madrid"
    }
  },
  
  // Datos del destinatario (usuario)
  recipient: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    taxId: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    bankAccount: { // 🔧 AÑADIR ESTE CAMPO
      type: String,
      required: false
    }
  },
  
  // Detalles de los servicios
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      required: true,
      default: 21 // 21% IVA por defecto
    }
  }],
  
  // Totales
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  
  // Método de pago
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash'],
    required: true
  },
  
  // Estado de la factura
  status: {
    type: String,
    enum: ['draft', 'issued', 'paid', 'cancelled'],
    default: 'draft'
  },
  
  // Referencia al pago asociado (si existe)
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pay',
    required: false
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes por usuario y período
invoiceSchema.index({ 'recipient.user': 1, 'period.year': 1, 'period.month': 1 });

// Índice para búsquedas por número de factura
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

export default mongoose.model('Invoice', invoiceSchema); 