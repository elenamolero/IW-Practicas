import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaDumbbell, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { useWorkout } from "../Context/WorkoutContext"; // Usa el contexto correcto

function CreateWorkoutPage() {
  const navigate = useNavigate();
  const { createWorkout } = useWorkout(); // Usa el context

  // ======= Estado =========
  const [formData, setFormData] = useState({
    order: "",
    workoutTypeId: "",
    workoutTypeTitle: "",
    workoutTypeDescription: "",
    description: "",
    intensity: "",
    series: "",
    repetitions: "",
    weight: "",
    rest: "",
    date: ""
  });
  
  

  // Notificación bonita
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  // ======= Handlers =========
  const handleChange = (e) => {
    const { name, value } = e.target;
    // No permitir números negativos en "order"
    if (name === "order" && Number(value) < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validar que la fecha no sea pasada
  const isDateValid = (dateStr) => {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const now = new Date();
    // Solo comparar la fecha (sin hora)
    selected.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return selected >= now;
  };

  // Función para crear el tipo de workout y devolver su _id
  const createWorkoutTypeAndGetId = async (title) => {
    const titleTrim = title.trim();
    const res = await fetch("http://localhost:4000/api/create-workout-type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        title: titleTrim, 
        description: formData.workoutTypeDescription 
      })
    });
    const data = await res.json();
    if (res.ok && data.workoutType && data.workoutType._id) {
      return data.workoutType._id;
    }
  
    throw new Error(data.message || "Error al obtener el tipo de workout");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight || Number(formData.weight) < 1)
      return setNotification({ show: true, message: "Peso (kg) debe ser ≥ 1", type: "error" });
    if (!formData.order || Number(formData.order) < 0)
      return setNotification({ show: true, message: "El orden no puede ser negativo", type: "error" });
    if (!isDateValid(formData.date))
      return setNotification({ show: true, message: "La fecha debe ser actual o futura", type: "error" });

    try {
      const newWorkoutTypeId = await createWorkoutTypeAndGetId(formData.workoutTypeTitle);

      // Forzar la fecha a ser solo día (sin hora)
      const dateOnly = formData.date.split("T")[0];
      const workoutToSend = {
        order: Number(formData.order),
        workoutTypeId: newWorkoutTypeId,
        description: formData.workoutTypeDescription,
        intensity: Number(formData.intensity),
        series: Number(formData.series),
        repetitions: Number(formData.repetitions),
        weight: Number(formData.weight),
        rest: Number(formData.rest),
        date: dateOnly // solo la fecha, sin hora
      };
      console.log("Workout a enviar al backend:", workoutToSend);
      console.log("Tipos de datos:", {
        order: typeof workoutToSend.order,
        workoutTypeId: typeof workoutToSend.workoutTypeId,
        description: typeof workoutToSend.description,
        intensity: typeof workoutToSend.intensity,
        series: typeof workoutToSend.series,
        repetitions: typeof workoutToSend.repetitions,
        weight: typeof workoutToSend.weight,
        rest: typeof workoutToSend.rest,
        date: typeof workoutToSend.date,
      });

      await createWorkout(workoutToSend); // Usa el context aquí

      setNotification({ show: true, message: "¡Workout creado correctamente!", type: "success" });
      setFormData({
        order: "",
        workoutTypeId: "",
        description: "",
        intensity: "",
        series: "",
        repetitions: "",
        weight: "",
        rest: "",
        date: ""
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
        navigate("/my-workouts-by-day/" + dateOnly);
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (
        msg &&
        msg.includes("Ya existe un workout con la misma fecha y orden")
      ) {
        setNotification({
          show: true,
          message: "Ya existe un workout con ese orden para ese día. Por favor, elige otro número de orden.",
          type: "error"
        });
      } else {
        setNotification({
          show: true,
          message: msg || "Error al crear el workout",
          type: "error"
        });
      }
      setTimeout(() => setNotification({ show: false, message: "", type: "error" }), 2500);
    }
  };

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const minDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // ======= UI =========
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="z-10 w-full max-w-2xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wider text-center mb-14">
          Añadir ejercicio
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-blue-100/80 rounded-3xl p-10 md:p-12 space-y-8 shadow-lg"
        >
          {/* ORDEN */}
          <InputField
            label={<span className="font-semibold text-[#072F5D]">Orden</span>}
            name="order"
            type="number"
            placeholder="Orden del ejercicio"
            value={formData.order}
            onChange={handleChange}
            required
          />

          {/* NOMBRE */}
          <InputField
            label={<span className="font-semibold text-[#072F5D]">Nombre</span>}
            name="workoutTypeTitle"
            placeholder="Título del ejercicio"
            value={formData.workoutTypeTitle}
            onChange={handleChange}
            icon={<FaDumbbell className="text-[#072F5D]" />}
            required
          />

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Descripción</label>
            <div className="relative">
              <textarea
                name="workoutTypeDescription"
                value={formData.workoutTypeDescription}
                onChange={handleChange}
                placeholder="Descripción del ejercicio (máx. 200)"
                maxLength={200}
                className="w-full rounded-full py-4 px-6 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              <FaInfoCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-[#072F5D]" />
            </div>
            <p className="text-right text-sm font-medium text-[#072F5D]">
              {formData.workoutTypeDescription?.length}/200 caracteres
            </p>
          </div>

          {/* INTENSIDAD */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Intensidad</label>
            <select
              name="intensity"
              value={formData.intensity}
              onChange={handleChange}
              className="w-full rounded-full py-4 px-6 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              required
            >
              <option value="" disabled>
                Selecciona intensidad (1‑10)
              </option>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} className="text-black">{n}</option>
              ))}
            </select>
          </div>

          {/* GRID DE CAMPOS NUMÉRICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="font-semibold text-[#072F5D]">Series</label>
              <InputField
                name="series"
                type="number"
                value={formData.series}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#072F5D]">Repeticiones</label>
              <InputField
                name="repetitions"
                type="number"
                value={formData.repetitions}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#072F5D]">Peso (kg)</label>
              <InputField
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-[#072F5D]">Descanso (seg)</label>
              <InputField
                name="rest"
                type="number"
                value={formData.rest}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* FECHA */}
          <div className="space-y-1">
            <label className="font-semibold text-[#072F5D]">Fecha</label>
            <InputField
              name="date"
              type="date"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              icon={<FaCalendarAlt className="text-[#072F5D]" />}
              required
            />
          </div>

          {/* BOTÓN */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-12 py-4 rounded-full transition"
            >
              AGREGAR EJERCICIO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPage;