import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaUsers, FaInfoCircle, FaCalendarAlt, FaUserTie } from "react-icons/fa";
import { useGroupClass } from "../Context/GroupClassesContext"; // Asegúrate de tener este context

function CreateGroupClassPage() {
  const navigate = useNavigate();
  const { createGroupClass } = useGroupClass(); // Debes tener este método en tu context

  // ======= Estado =========
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    schedule: "",
    maxCapacity: "",
    assignedTrainer: "",
    difficultyLevel: "",
  });

  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // ======= Handlers =========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validar que la fecha no sea pasada
  const isDateValid = (dateStr) => {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const now = new Date();
    return selected >= now;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.maxCapacity || Number(formData.maxCapacity) < 1)
      return setNotification({ show: true, message: "Capacidad debe ser ≥ 1", type: "error" });
    if (!isDateValid(formData.schedule))
      return setNotification({ show: true, message: "La fecha debe ser actual o futura", type: "error" });

    try {
      await createGroupClass({
        ...formData,
        maxCapacity: Number(formData.maxCapacity),
      });

      setNotification({ show: true, message: "¡Clase grupal creada correctamente!", type: "success" });
      setFormData({
        name: "",
        description: "",
        schedule: "",
        maxCapacity: "",
        assignedTrainer: "",
        difficultyLevel: "",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
        navigate("/group-classes-by-day/" + formData.schedule.split("T")[0]);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setNotification({
        show: true,
        message: msg || "Error al crear la clase grupal",
        type: "error"
      });
      setTimeout(() => setNotification({ show: false, message: "", type: "error" }), 2500);
    }
  };

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const minDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // ======= UI =========
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      {/* Notificación bonita */}
      {notification.show && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 rounded-xl shadow-lg text-lg font-semibold transition-all duration-300
            ${notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-400"
              : "bg-red-100 text-red-800 border border-red-400"}
          `}
        >
          {notification.message}
        </div>
      )}

      <div className="z-10 w-full max-w-2xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wider text-center mb-14">
          Crea una Clase Grupal
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-blue-100/80 rounded-3xl p-10 md:p-12 space-y-8 shadow-lg"
        >
          {/* NOMBRE */}
          <InputField
            label={<span className="font-semibold text-[#072F5D]">Nombre</span>}
            name="name"
            placeholder="Nombre de la clase"
            value={formData.name}
            onChange={handleChange}
            icon={<FaUsers className="text-[#072F5D]" />}
            required
          />

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Descripción</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción de la clase (máx. 200)"
                maxLength={200}
                className="w-full rounded-full py-4 px-6 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              <FaInfoCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-[#072F5D]" />
            </div>
            <p className="text-right text-sm font-medium text-[#072F5D]">
              {formData.description.length}/200 caracteres
            </p>
          </div>

          {/* FECHA Y HORA */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Fecha y hora</label>
            <InputField
              name="schedule"
              type="datetime-local"
              min={minDateTime}
              value={formData.schedule}
              onChange={handleChange}
              icon={<FaCalendarAlt className="text-[#072F5D]" />}
              required
            />
          </div>

          {/* CAPACIDAD */}
          <InputField
            label={<span className="font-semibold text-[#072F5D]">Capacidad máxima</span>}
            name="maxCapacity"
            type="number"
            min={1}
            placeholder="Capacidad máxima"
            value={formData.maxCapacity}
            onChange={handleChange}
            required
          />

          {/* ENTRENADOR ASIGNADO */}
          <InputField
            label={<span className="font-semibold text-[#072F5D]">Entrenador asignado (ID)</span>}
            name="assignedTrainer"
            placeholder="ID del entrenador"
            value={formData.assignedTrainer}
            onChange={handleChange}
            icon={<FaUserTie className="text-[#072F5D]" />}
            required
          />

          {/* DIFICULTAD */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Dificultad</label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="w-full rounded-full py-4 px-6 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            >
              <option value="" disabled>
                Selecciona dificultad
              </option>
              <option value="beginner" className="text-black">Principiante</option>
              <option value="intermediate" className="text-black">Intermedio</option>
              <option value="advanced" className="text-black">Avanzado</option>
            </select>
          </div>

          {/* BOTÓN */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-12 py-4 rounded-full transition"
            >
              CREAR CLASE GRUPAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupClassPage;