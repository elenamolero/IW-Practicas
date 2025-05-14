import React, { createContext, useContext, useState } from "react";
import { workoutRequest } from "../api/workout";

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkoutsByWeek = async (startDate) => {
    try {
      setLoading(true);

      // Calcular el inicio de la semana (lunes) basado en la fecha proporcionada
      const inputDate = new Date(startDate);
      const dayOfWeek = inputDate.getDay(); // 0 (domingo) a 6 (sábado)
      const startOfWeek = new Date(inputDate.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))); // Ajustar para que el lunes sea el inicio

      // Generar las fechas de lunes a domingo
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      });

      // Realizar solicitudes para cada día de la semana
      const workoutsByDay = await Promise.all(
        dates.map(async (date) => {
          const response = await workoutRequest(date);
          return { date, workouts: response.data.workouts };
        })
      );

      setWeeklyWorkouts(workoutsByDay);
    } catch (error) {
      console.error("Error al obtener los workouts de la semana:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkoutContext.Provider value={{ weeklyWorkouts, fetchWorkoutsByWeek, loading }}>
      {children}
    </WorkoutContext.Provider>
  );
};