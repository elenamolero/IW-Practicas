import mongoose from "mongoose";

const groupClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  schedule: {
    type: Date,
    required: true
  },
  maxCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // referencing registered users (members)
    }
  ],
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // referencing a trainer user
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('GroupClass', groupClassSchema);
