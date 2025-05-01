import mongoose from "mongoose";

const muscleRoomReserveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  muscleRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MuscleRoom',
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

// Índice para evitar reservas duplicadas en el mismo horario para el mismo usuario
muscleRoomReserveSchema.index({ user: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model('MuscleRoomReserve', muscleRoomReserveSchema); 