import mongoose from "mongoose";

const gymReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String, // ejemplo: "18:00-19:00"
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('GymReservation', gymReservationSchema);
