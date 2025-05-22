import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import axios from "axios";

function MuscleRoomPage() {
  const [reservations, setReservations] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchStartTime, setSearchStartTime] = useState("");
  const [searchEndTime, setSearchEndTime] = useState("");
  const [filteredReserves, setFilteredReserves] = useState([]);
  const [muscleRooms, setMuscleRooms] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [newReservation, setNewReservation] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: ""
  });
  const [editingReservation, setEditingReservation] = useState(null);
  const [editForm, setEditForm] = useState({
  date: "",
  startTime: "",
  endTime: "",
  notes: ""
  });

  useEffect(() => {
    fetchReservations();
    fetchMuscleRooms();
  }, []);

  const handleDeleteReserve = async (reserveId) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar esta reserva?")) return;
  
    try {
      await axios.delete(`http://localhost:4000/api/muscle-room-reserves/${reserveId}`, {
        withCredentials: true,
      });
      alert("Reserva cancelada correctamente");
      fetchReservations(); // recarga la lista
      setFilteredReserves((prev) => prev.filter((r) => r._id !== reserveId)); // opcional: elimina visualmente sin volver a buscar
    } catch (error) {
      alert(error.response?.data?.message || "Error al cancelar la reserva");
    }
  };

  const openEditModal = (res) => {
    setEditingReservation(res);
    setEditForm({
      date: res.date,
      startTime: res.startTime,
      endTime: res.endTime,
      notes: res.notes || ""
    });
  };
  
  const handleUpdateReserve = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/muscle-room-reserves/${editingReservation._id}`,
        editForm,
        { withCredentials: true }
      );
      alert("Reserva modificada correctamente");
      setEditingReservation(null);
      fetchReservations();
    } catch (error) {
      alert(error.response?.data?.message || "Error al modificar la reserva");
    }
  };

  
  const fetchMuscleRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/muscle-rooms", {
        withCredentials: true
      });
      setMuscleRooms(res.data);
    } catch (error) {
      console.error("Error al obtener las salas de musculación:", error);
    }
  };
  

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/my-muscle-room-reserves", {
        withCredentials: true
      });
      setReservations(res.data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  const handleReserve = async () => {
    try {
        const muscleRoomId = newReservation.muscleRoom;
    
        await axios.post("http://localhost:4000/api/create-muscle-room-reserve", {
          muscleRoom: muscleRoomId,
          date: newReservation.date,
          startTime: newReservation.startTime,
          endTime: newReservation.endTime,
          notes: newReservation.notes
        }, {
          withCredentials: true
        });
    
        alert("Reserva realizada correctamente");
        fetchReservations();
        setNewReservation({ date: "", startTime: "", endTime: "", notes: "" });
      } catch (error) {
        alert(error.response?.data?.message || "Error al crear la reserva");
      }
  };

  const handleSearch = () => {
    const results = reservations.filter((res) => {
      const matchDate = searchDate ? res.date.includes(searchDate) : true;

      const matchStart =
        searchStartTime ? res.startTime >= searchStartTime : true;

      const matchEnd =
        searchEndTime ? res.startTime <= searchEndTime : true;

      return matchDate && matchStart && matchEnd;
    });

    setFilteredReserves(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          RESERVA TU PLAZA EN LA SALA
        </h1>

        <p className="text-xl text-center text-gray-700 mb-10">
          Debido además al COVID-19, la entrada de miembros al gimnasio está limitada por aforo según las instituciones públicas, por lo que el aforo de la sala de musculación no puede superar los 170. Se podrá reservar con 48 horas de antelación.
        </p>

        {/* Buscador de reservas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">Mis Reservas</h2>

          <div className="bg-blue-100 rounded-3xl p-6 space-y-4">
            <div>
              <label className="block font-semibold mb-1">Fecha</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full rounded-full px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hora Inicio</label>
              <input
                type="time"
                value={searchStartTime}
                onChange={(e) => setSearchStartTime(e.target.value)}
                className="w-full rounded-full px-4 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Hora Fin</label>
              <input
                type="time"
                value={searchEndTime}
                onChange={(e) => setSearchEndTime(e.target.value)}
                className="w-full rounded-full px-4 py-2"
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleSearch}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-8 py-2 rounded-full"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {showResults && (
            <>
              {filteredReserves.length > 0 ? (
                filteredReserves.map((res) => (
                  <div key={res._id} className="bg-blue-100 rounded-3xl p-6 mt-6 text-center">
                    <div className="mb-2 flex justify-center items-center gap-2">
                        <FaCalendarAlt /> Fecha: {new Date(res.date).toLocaleDateString('es-ES')}
                    </div>
                    <div className="mb-2 flex justify-center items-center gap-2">
                      <FaClock /> Hora Inicio: {res.startTime}
                    </div>
                    <div className="mb-4 flex justify-center items-center gap-2">
                      <FaClock /> Hora Fin: {res.endTime}
                    </div>
                    <div className="flex justify-center gap-10">
                    <button
                        className="text-blue-500 font-semibold hover:underline"
                        onClick={() => openEditModal(res)}
                        >
                        Modificar
                    </button>
                      <button
                        className="text-red-600 font-semibold hover:underline"
                        onClick={() => handleDeleteReserve(res._id)}
                        >
                            Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No hay reservas para ese rango horario.
                </p>
              )}
            </>
          )}
        </section>

        {/* Nueva reserva */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-4">Nueva Reserva</h2>
          <div className="bg-blue-100 rounded-3xl p-6 space-y-4">
            <div className="relative">
            <label className="block text-sm font-semibold mb-1">Sala de Musculación</label>
            <select
            className="w-full rounded-full px-4 py-2"
            value={newReservation.muscleRoom || ""}
            onChange={(e) =>
              setNewReservation({ ...newReservation, muscleRoom: e.target.value })
            }
            >
            <option value="">Selecciona una sala</option>
                {muscleRooms.map((room) => (
            <option key={room._id} value={room._id}>
            {room.name}
            </option>
            ))}
            </select>   
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Fecha</label>
              <input
                type="date"
                className="w-full rounded-full px-4 py-2"
                value={newReservation.date}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Hora Inicio</label>
              <input
                type="time"
                className="w-full rounded-full px-4 py-2"
                value={newReservation.startTime}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    startTime: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Hora Fin</label>
              <input
                type="time"
                className="w-full rounded-full px-4 py-2"
                value={newReservation.endTime}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    endTime: e.target.value,
                  })
                }
              />
            </div>
            <div className="text-center pt-4">
              <button
                onClick={handleReserve}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-8 py-2 rounded-full"
              >
                Reservar
              </button>
            </div>
          </div>
        </section>
        {editingReservation && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-xl w-full max-w-md">
      <h3 className="text-2xl font-bold mb-4">Modificar Reserva</h3>
      <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Fecha</label>
        <input
            type="date"
            className="w-full rounded-full px-4 py-2"
            value={
                editForm.date
            ? new Date(editForm.date).toISOString().split("T")[0]
            : ""
            }
            onChange={(e) =>
            setEditForm({ ...editForm, date: e.target.value })
        }
        />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Hora Inicio</label>
          <input
            type="time"
            className="w-full rounded-full px-4 py-2"
            value={editForm.startTime}
            onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Hora Fin</label>
          <input
            type="time"
            className="w-full rounded-full px-4 py-2"
            value={editForm.endTime}
            onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() => setEditingReservation(null)}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-full"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpdateReserve}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          Guardar Cambios
        </button>
        </div>
      </div>
    </div>
    )}
      </main>
    </div>
  );
}

export default MuscleRoomPage;
