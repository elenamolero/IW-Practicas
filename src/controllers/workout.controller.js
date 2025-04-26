import Workout from "../models/workout.model.js";
import User from "../models/user.model.js";

export const createWorkout = async (req, res) => {
  try {
    const {
      title,
      user_id,
      description,
      date,
      series,
      repetitions,
      rest,
      order,
      intensity
    } = req.body;
    if (!title || !user_id || !date || !series || !repetitions || !rest || !order || !intensity) {
      return res.status(400).json({
        message: "All required fields must be completed."
      });
    }
    const workoutDate = new Date(date);
    console.log("Received date (date):", date);
    console.log("Converted workout date:", workoutDate);

    if (isNaN(workoutDate.getTime())) {
      return res.status(400).json({
        message: "The workout date is invalid. Expected format: YYYY-MM-DDTHH:mm:ss."
      });
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const intensityScale = { min: 1, max: 10 };
    if (intensity < intensityScale.min || intensity > intensityScale.max) {
      return res.status(400).json({
        message: `Intensity must be between ${intensityScale.min} and ${intensityScale.max}.`
      });
    }
    const existingWorkout = await Workout.findOne({ date: workoutDate, order });
    if (existingWorkout) {
      return res.status(400).json({
        message: "A workout with the same date and order already exists."
      });
    }
    if (user.role !== "member") {
        return res.status(400).json({
          message: "The user associated with this workout must have the role of 'member'."
        });
      }
    const newWorkout = new Workout({
      title,
      user_id,
      description,
      date: workoutDate, // Save the already converted date
      series,
      repetitions,
      rest,
      order,
      intensity
    });
    const savedWorkout = await newWorkout.save();
    res.status(201).json({
      message: "Workout created successfully.",
      workout: savedWorkout
    });

  } catch (error) {
    console.error("Error creating workout: ", error);
    res.status(500).json({ message: error.message });
  }
};
