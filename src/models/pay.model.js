import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  receiptUrl: {
    type: String, // link al PDF del recibo
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);
