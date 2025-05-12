import axios from "./axios.js";

export const workoutRequest= () =>axios.get(`/my-workouts-by-day/${date}`);