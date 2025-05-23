import axios from "./axios.js";

export const workoutRequest = (date, userId = null) => {
  const query = userId ? `?userId=${userId}` : "";
  return axios.get(`/my-workouts-by-day/${date}${query}`, {
    withCredentials: true
  });
};

export const createWorkoutRequest = (workoutData) =>
  axios.post("/create-workout", workoutData, { withCredentials: true });