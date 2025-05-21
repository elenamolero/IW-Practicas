import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupClass } from "../Context/GroupClassesContext";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";
import "./Styles/WorkoutPage.css";

const GroupClassesPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { weeklyClasses, fetchClassesByWeek, loading } = useGroupClass();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(date);

  useEffect(() => {
    console.log("[GroupClassesPage] useEffect called with date:", date);
    if (date) {
      fetchClassesByWeek(date);
      setSelectedDate(date);
    }
    // SOLO depende de date, no de fetchClassesByWeek
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Loader solo para usuario
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">No se pudo cargar el usuario. ¿Has iniciado sesión?</p>
      </div>
    );
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const goToPreviousWeek = () => {
    const current = new Date(date);
    current.setDate(current.getDate() - 7);
    const prevWeek = current.toISOString().split("T")[0];
    navigate(`/group-classes-by-day/${prevWeek}`);
  };

  const goToNextWeek = () => {
    const current = new Date(date);
    current.setDate(current.getDate() + 7);
    const nextWeek = current.toISOString().split("T")[0];
    navigate(`/group-classes-by-day/${nextWeek}`);
  };

  const selectedClasses = weeklyClasses.find((day) => day.date === selectedDate);

  const month = selectedDate
    ? new Date(selectedDate).toLocaleDateString("es-ES", { month: "long" })
    : "";

  return (
    <div className="group-classes-page bg-white text-black min-h-screen p-6 pt-20">
      <Navbar />
      <h1 className="text-center text-4xl font-bold mb-2">Clases Grupales</h1>
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
          <div className="group-classes-table border border-gray-300 rounded-lg overflow-hidden flex-1 mx-2">
            {/* Encabezado de la tabla */}
            <div className="group-classes-header grid grid-cols-7 bg-gray-100 text-center font-bold text-lg">
              {weeklyClasses.map(({ date }) => (
                <div
                  key={date}
                  className={`group-class-day-header p-4 border-b border-gray-300 cursor-pointer ${
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
            <div className="group-classes-content p-4">
              {selectedClasses && selectedClasses.classes.length > 0 ? (
                selectedClasses.classes.map((groupClass) => (
                  <div key={groupClass._id} className="group-class-item mb-4 flex justify-between items-start border-b pb-4">
                    <div className="group-class-info-left">
                      <h3 className="font-bold text-lg">{groupClass.name}</h3>
                      <p className="text-sm text-gray-600">{groupClass.description}</p>
                      <p className="text-sm text-gray-600">
                        Horario: {new Date(groupClass.schedule).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="group-class-info-right text-right flex flex-col items-end">
                      <p className="text-sm font-bold text-red-500 mb-2">
                        <b>Intensidad:</b> {groupClass.difficultyLevel || "No especificada"}
                      </p>
                      <p className="text-sm font-bold text-blue-500">
                        Entrenador: {groupClass.assignedTrainer?.firstName || groupClass.assignedTrainer?.name || "No asignado"}
                      </p>
                      <p className="text-sm">
                        Plazas Ocupadas: {groupClass.attendees?.length || 0} / {groupClass.maxCapacity}
                      </p>
                      {/* Botones según el rol */}
                      <div className="flex gap-2 mt-4">
                        {/* Para entrenador */}
                        {user?.role === "trainer" && (
                          <>
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">Modificar</button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Eliminar</button>
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Asistentes</button>
                          </>
                        )}
                        {/* Para miembro */}
                        {user?.role === "member" && (
                          <>
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Asistentes</button>
                            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs">Cancelar</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay clases para este día.</p>
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
    </div>
  );
};

export default GroupClassesPage;