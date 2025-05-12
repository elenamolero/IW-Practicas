import React, { createContext, useContext, useState } from "react";
import { workoutRequest } from "../api/workout";

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkoutsByWeek = async () => {
    try {
      setLoading(true);


      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Lunes
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
      });

        // Fetch workouts for each date in the week
      const workoutsByDay = await Promise.all(
        dates.map(async (date) => {
          const response = await workoutRequest(date);
          return { date, workouts: response.data.workouts };
        })
      );

      setWeeklyWorkouts(workoutsByDay);
    } catch (error) {
      console.error("Error getting workouts of the week:", error);
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