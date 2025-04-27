import mongoose from "mongoose";

const muscleRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: false
  },
  equipment: [{
    type: String,
    required: false
  }],
  status: {
    type: String,
    enum: ['available', 'maintenance', 'reserved'],
    default: 'available'
  }
}, {
  timestamps: true
});

export default mongoose.model('MuscleRoom', muscleRoomSchema); 