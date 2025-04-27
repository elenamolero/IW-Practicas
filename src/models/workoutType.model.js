import mongoose from "mongoose";

const workoutTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('WorkoutType', workoutTypeSchema); 