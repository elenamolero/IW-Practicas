import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  workoutType_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutType',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  series: {
    type: Number,
    required: true,
    min: 1
  },
  repetitions: {
    type: Number,
    required: true,
    min: 1
  },
  rest: {
    type: Number,
    required: true,
    min: 0 // Rest time in seconds
  },
  order: {
    type: Number,
    required: true,
    min: 1 
  },
  intensity: {
    type: String,
    required: true,
    min: 1,
    max: 10 // Scale of 1 to 10
  },
  weigh: {
    type: Number,
    required: true,
    min: 1,
    max: 10 // Scale of 1 to 10
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);
