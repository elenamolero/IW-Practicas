import mongoose from "mongoose";

const paySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'bank_transfer', 'cash']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: false
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  relatedService: {
    type: String,
    enum: ['membership', 'class', 'personal_training', 'other'],
    required: true
  },
  relatedServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes por usuario y estado
paySchema.index({ user: 1, status: 1 });

export default mongoose.model('Pay', paySchema);
