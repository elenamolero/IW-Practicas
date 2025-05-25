import axios from "./axios.js";

export const workoutRequest = (date, userId = null) => {
  const query = userId ? `?userId=${userId}` : "";
  return axios.get(`/my-workouts-by-day/${date}${query}`, {
    withCredentials: true
  });
};

export const createWorkoutRequest = (workoutData) =>
  axios.post("/create-workout", workoutData, { withCredentials: true });

export const createWorkoutForMemberRequest = (workoutData, memberId) =>
  axios.post(`/create-workout/${memberId}`, workoutData, {
    withCredentials: true
  });

// Obtener los workouts de un miembro concreto en una fecha específica
export const memberWorkoutsByDateRequest = (memberId, date) =>
  axios.get(`/member-workouts-by-day/${memberId}/${date}`, {
    withCredentials: true
  });
