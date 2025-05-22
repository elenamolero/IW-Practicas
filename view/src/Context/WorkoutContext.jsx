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

      // Calcular el inicio de la semana (lunes)
      const inputDate = new Date(startDate);
      const dayOfWeek = inputDate.getDay();
      const startOfWeek = new Date(inputDate.setDate(inputDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));

      // Fechas de lunes a domingo de la semana actual
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      // Fechas de la semana anterior
      const prevWeekStart = new Date(startOfWeek);
      prevWeekStart.setDate(startOfWeek.getDate() - 7);
      const prevWeekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(prevWeekStart);
        date.setDate(prevWeekStart.getDate() + i);
        return date.toISOString().split("T")[0];
      });

      // Pedir workouts de la semana actual
      const workoutsByDay = await Promise.all(
        dates.map(async (date) => {
          const response = await workoutRequest(date);
          return { date, workouts: response.data.workouts };
        })
      );

      // Si hay días vacíos, pedir la semana anterior y copiar los workouts si existen
      const hasEmptyDays = workoutsByDay.some(day => !day.workouts || day.workouts.length === 0);
      let prevWeekWorkouts = [];
      if (hasEmptyDays) {
        prevWeekWorkouts = await Promise.all(
          prevWeekDates.map(async (date) => {
            const response = await workoutRequest(date);
            return { date, workouts: response.data.workouts };
          })
        );
      }

      // Rellenar días vacíos con los de la semana anterior
      const filledWorkouts = workoutsByDay.map((day, idx) => {
        if (!day.workouts || day.workouts.length === 0) {
          const prev = prevWeekWorkouts[idx];
          return prev && prev.workouts.length > 0
            ? { ...day, workouts: prev.workouts }
            : day;
        }
        return day;
      });

      setWeeklyWorkouts(filledWorkouts);
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