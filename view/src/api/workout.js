import axios from "./axios.js";

export const workoutRequest = (date) => axios.get(`/my-workouts-by-day/${date}`);

export const createWorkoutRequest = (workoutData) =>
  axios.post("/create-workout", workoutData, { withCredentials: true });