// ...existing imports...
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupClass } from "../Context/GroupClassesContext";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";
import "./Styles/WorkoutPage.css";

const GroupClassesPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { weeklyClasses, fetchClassesByWeek, reserveGroupClass, cancelGroupClassReservation, deleteGroupClass, loading } = useGroupClass();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(date);
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState("success"); 

  useEffect(() => {
    if (date) {
      fetchClassesByWeek(date);
      setSelectedDate(date);
    }
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

  const handleReserve = async (classId) => {
    try {
      await reserveGroupClass(classId);
      setMessage("Reserva realizada con éxito");
      setMessageType("success");
      await fetchClassesByWeek(selectedDate);
    } catch (error) {
      setMessage(error.message || "Error al reservar la clase");
      setMessageType("error");
    }
    setTimeout(() => setMessage(null), 1900);
  };

  const handleCancelReservation = async (classId) => {
    try {
      await cancelGroupClassReservation(classId);
      setMessage("Reserva cancelada con éxito");
      setMessageType("success");
      await fetchClassesByWeek(selectedDate);
    } catch (error) {
      setMessage(error.message || "Error al cancelar la reserva");
      setMessageType("error");
    }
    setTimeout(() => setMessage(null), 1900);
  };


const handleDeleteClass = async (classId) => {
  // Mostrar confirmación personalizada solo en producción
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  let confirmDelete = true;
  if (!isLocalhost) {
    confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta clase grupal? Esta acción no se puede deshacer.");
  }
  if (!confirmDelete) return;
  try {
    await deleteGroupClass(classId);
    setMessage("Clase eliminada con éxito");
    setMessageType("success");
    await fetchClassesByWeek(selectedDate);
  } catch (error) {
    setMessage(error.message || "Error al eliminar la clase");
    setMessageType("error");
  }
  setTimeout(() => setMessage(null), 1900);
};

  return (
    <div className="group-classes-page bg-white text-black min-h-screen p-6 pt-20">
      <Navbar />
      {/* Mensaje flotante */}
      {message && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 text-lg font-semibold ${
            messageType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message}
        </div>
      )}
      <h1 className="text-center text-4xl font-bold mb-2">Clases Grupales</h1>
      <h2 className="text-center text-2xl font-semibold text-gray-600 mb-6">(duración de 1 h/clase)</h2>
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
              selectedClasses.classes.map((groupClass) => {
                const userId = String(user.id);
                const isReservedByUser = Array.isArray(groupClass.attendees)
                  ? groupClass.attendees.some(att => {
                      if (att && typeof att === "object" && att._id) {
                        return String(att._id) === userId;
                      }
                      return String(att) === userId;
                    })
                  : false;

                // Comprobar si la clase es futura o actual
                const now = new Date();
                const classDate = new Date(groupClass.schedule);
                const isFutureOrNow = classDate >= now;

                return (
                  <div
                    key={groupClass._id}
                    className="group-class-item mb-4 flex justify-between items-start border-b pb-4 transition-colors"
                  >
                    <div className="group-class-info-left">
                      <h3 className="font-bold text-lg flex items-center">
                        {groupClass.name}
                      </h3>
                      <p className="text-sm text-gray-600">{groupClass.description}</p>
                      <p className="text-sm text-gray-600">
                        Horario: {classDate.toISOString().slice(11, 16)} 
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
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs">
                              Modificar
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                              onClick={() => handleDeleteClass(groupClass._id)}
                            >
                              Eliminar
                            </button>
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                              onClick={() => handleShowAttendees(groupClass._id)}
                            >
                              Asistentes
                            </button>
                            <button className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg text-l">
                              + Añadir Clase
                            </button>
                          </>
                        )}
                        {/* Para miembro */}
                        {user?.role === "member" && isFutureOrNow && (
                          <>
                            {isReservedByUser ? (
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold cursor-not-allowed select-none">
                                Reservada
                              </span>
                            ) : (
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                                onClick={() => handleReserve(groupClass._id)}
                              >
                                Reservar
                              </button>
                            )}
                            {/* Botón cancelar solo si está reservada */}
                            {isReservedByUser && (
                              <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                                onClick={() => handleCancelReservation(groupClass._id)}
                              >
                                Cancelar
                              </button>
                            )}
                            {/* Botón asistentes también para member */}
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                              onClick={() => handleShowAttendees(groupClass._id)}
                            >
                              Asistentes
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
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