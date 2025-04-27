import mongoose from "mongoose";

const bodybuildingReserveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    required: true,
    enum: ['press', 'squat', 'deadlift', 'bench', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Índice para evitar reservas duplicadas en el mismo horario
bodybuildingReserveSchema.index({ date: 1, startTime: 1, endTime: 1, equipment: 1 }, { unique: true });

export default mongoose.model('BodybuildingReserve', bodybuildingReserveSchema);
