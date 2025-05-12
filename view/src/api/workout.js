import axios from "./axios.js";

export const workoutRequest = (date) => axios.get(`/my-workouts-by-day/${date}`);