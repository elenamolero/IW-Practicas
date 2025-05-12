import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import "./Styles/WorkoutPage.css"; // Asegúrate de tener este archivo CSS

const WorkoutPage = () => {
  const { date } = useParams(); // Captura la fecha de la URL
  const { weeklyWorkouts, fetchWorkoutsByWeek, loading } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(date); // Estado inicial basado en la fecha de la URL

  useEffect(() => {
    if (date) {
      fetchWorkoutsByWeek(date); // Llama a la función para obtener los workouts de la semana
      setSelectedDate(date); // Establece el día seleccionado como el día de la URL
    }
  }, [date]);

  const handleDateClick = (date) => {
    setSelectedDate(date); // Cambia el día seleccionado al hacer clic
  };

  const selectedWorkouts = weeklyWorkouts.find((day) => day.date === selectedDate);

  // Calcula el mes basado en la fecha seleccionada
  const month = selectedDate
    ? new Date(selectedDate).toLocaleDateString("es-ES", { month: "long" })
    : "";

  return (
    <div className="workout-page bg-white text-black min-h-screen p-6">
      <h1 className="text-center text-4xl font-bold mb-2">Rutina</h1>
      <h2 className="text-center text-2xl font-semibold text-gray-600 mb-6">{month}</h2>
      {loading ? (
        <p className="text-center text-xl">Cargando...</p>
      ) : (
        <div className="workout-table border border-gray-300 rounded-lg overflow-hidden">
          {/* Encabezado de la tabla */}
          <div className="workout-header grid grid-cols-7 bg-gray-100 text-center font-bold text-lg">
            {weeklyWorkouts.map(({ date }) => (
              <div
                key={date}
                className={`workout-day-header p-4 border-b border-gray-300 cursor-pointer ${
                  date === selectedDate ? "bg-blue-200" : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                {new Date(date).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>

          {/* Contenido de la tabla */}
          <div className="workout-content p-4">
            {selectedWorkouts && selectedWorkouts.workouts.length > 0 ? (
              selectedWorkouts.workouts.map((workout) => (
                <div key={workout._id} className="workout-item mb-4 flex justify-between items-start border-b pb-4">
                  {/* Información izquierda */}
                  <div className="workout-info-left">
                    <h3 className="font-bold text-lg">{workout.workoutType_id.title}</h3>
                    <p className="text-sm text-gray-600">{workout.workoutType_id.description}</p>
                  </div>
                  {/* Información derecha */}
                  <div className="workout-info-right text-right">
                    <p className="text-sm font-bold text-red-500">
                      Intensidad: {workout.intensity}
                    </p>
                    <p className="text-sm">Series: {workout.series}</p>
                    <p className="text-sm">Repeticiones: {workout.repetitions}</p>
                    <p className="text-sm">Descanso: {workout.rest} segundos</p>
                    <p className="text-sm">Peso: {workout.weigh} kg</p>
                    
                    <div className="flex justify-end gap-4 mt-2">
                      <button className="text-blue-500 hover:underline">Modificar</button>
                      <button className="text-red-500 hover:underline">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay workouts para este día.</p>
            )}
          </div>
        </div>
      )}
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg text-2xl">
        +
      </button>
    </div>
  );
};

export default WorkoutPage;