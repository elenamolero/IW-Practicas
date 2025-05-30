import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkout } from "../Context/WorkoutContext";
import Navbar from "../Components/Navbar";
import "./Styles/WorkoutPage.css";
import { useLocation } from "react-router-dom";

const WorkoutPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { weeklyWorkouts, fetchWorkoutsByWeek, loading } = useWorkout();
  const [selectedDate, setSelectedDate] = useState(date);
  const location = useLocation();
  const initialUserId = location.state?.userId || null;
  const [userId, setUserId] = useState(initialUserId);
  const userIdFromTrainer = location.state?.userId;

  useEffect(() => {
    if (date) {
      fetchWorkoutsByWeek(date,userId);
      setSelectedDate(date);
    }
  }, [date, userIdFromTrainer]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Navegación entre semanas
  const goToPreviousWeek = () => {
    const current = new Date(date);
    current.setDate(current.getDate() - 7);
    const prevWeek = current.toISOString().split("T")[0];
    navigate(`/my-workouts-by-day/${prevWeek}`,{
      state: { userId }
    });
  };

  const goToNextWeek = () => {
    const current = new Date(date);
    current.setDate(current.getDate() + 7);
    const nextWeek = current.toISOString().split("T")[0];
    navigate(`/my-workouts-by-day/${nextWeek}`, {
      state: { userId }
    });
  };

  const handleDelete = async (workoutId, workoutTypeId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este workout y su tipo de ejercicio?")) return;
  
    try {
      // 1. Eliminar el workout
      const resWorkout = await fetch(
        `http://localhost:4000/api/workouts/${workoutId}${userId ? `?userId=${userId}` : ""}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      const dataWorkout = await resWorkout.json();
      if (!resWorkout.ok) throw new Error(dataWorkout.message);
  
      // 2. Eliminar el workoutType
      const resType = await fetch(
        `http://localhost:4000/api/workout-types/${workoutTypeId}${userId ? `?userId=${userId}` : ""}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
  
      const dataType = await resType.json();
      if (!resType.ok) throw new Error(dataType.message);
  
      alert("Workout y tipo de ejercicio eliminados correctamente");
      fetchWorkoutsByWeek(selectedDate, userId); // Recargar lista
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };
  

  const selectedWorkouts = weeklyWorkouts.find((day) => day.date === selectedDate);

  const month = selectedDate
    ? new Date(selectedDate).toLocaleDateString("es-ES", { month: "long" })
    : "";

  return (
    <div className="workout-page bg-white text-black min-h-screen p-6 pt-20">
      <Navbar />
      <h1 className="text-center text-4xl font-bold mb-2">Rutina</h1>
      <h2 className="text-center text-2xl font-semibold text-gray-600 mb-6">{month}</h2>
      {loading ? (
        <p className="text-center text-xl">Cargando...</p>
      ) : (
        <div className="flex justify-center w-full max-w-7xl mx-auto mb-8">
          {/* Flecha izquierda */}
          <div className="flex flex-col items-start justify-start">
            <button
              className="bg-white border border-gray-300 rounded-full w-10 h-10 mt-2 flex items-center justify-center text-2xl hover:bg-gray-100"
              onClick={goToPreviousWeek}
              aria-label="Semana anterior"
            >
              &#60;
            </button>
          </div>
          {/* Tabla */}
          <div className="workout-table border border-gray-300 rounded-lg overflow-hidden flex-1 mx-2">
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
                    <div className="workout-info-left">
                      <h3 className="font-bold text-lg">{workout.workoutType_id.title}</h3>
                      <p className="text-sm text-gray-600">{workout.workoutType_id.description}</p>
                    </div>
                    <div className="workout-info-right text-right">
                      <p className="text-sm font-bold text-red-500">
                        Intensidad: {workout.intensity}
                      </p>
                      <p className="text-sm">Series: {workout.series}</p>
                      <p className="text-sm">Repeticiones: {workout.repetitions}</p>
                      <p className="text-sm">Descanso: {workout.rest} segundos</p>
                      <p className="text-sm">Peso: {workout.weight} kg</p>
                      <div className="flex justify-end gap-4 mt-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => navigate(`/edit-workout/${workout._id}`, {
                            state: { userId }
                          })}                          
                        >
                        Modificar
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDelete(workout._id, workout.workoutType_id._id)}
                        >
                        Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay workouts para este día.</p>
              )}
            </div>
          </div>
          {/* Flecha derecha */}
          <div className="flex flex-col items-start justify-start">
            <button
              className="bg-white border border-gray-300 rounded-full w-10 h-10 mt-2 flex items-center justify-center text-2xl hover:bg-gray-100"
              onClick={goToNextWeek}
              aria-label="Semana siguiente"
            >
              &#62;
            </button>
          </div>
        </div>
      )}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg text-l"
        onClick={() => navigate("/create-workout")}
      >
        + Añadir Ejercicio
      </button>
    </div>
  );
};

export default WorkoutPage;