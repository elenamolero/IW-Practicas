import axios from "./axios.js";

export const workoutRequest= () =>axios.post(`/my-workouts`);