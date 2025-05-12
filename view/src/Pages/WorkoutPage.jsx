import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";

const WorkoutPage = () => {
  const { date } = useParams(); // Captura la fecha de la URL
  const { weeklyWorkouts, fetchWorkoutsByWeek, loading } = useWorkout();

  useEffect(() => {
    if (date) {
      fetchWorkoutsByWeek(date); // Llama a la función para obtener los workouts de la semana
    }
  }, [date]);

  return (
    <div className="workout-page">
      <h1>Rutina Semanal</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="workout-list">
          {weeklyWorkouts.map(({ date, workouts }) => (
            <div key={date} className="workout-day">
              <h2>{new Date(date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</h2>
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <div key={workout._id} className="workout-item">
                    <h3>{workout.workoutType_id.title}</h3>
                    <p>{workout.workoutType_id.description}</p>
                    <p>Series: {workout.series}</p>
                    <p>Repeticiones: {workout.repetitions}</p>
                    <p>Descanso: {workout.rest} segundos</p>
                  </div>
                ))
              ) : (
                <p>No hay workouts para este día.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;