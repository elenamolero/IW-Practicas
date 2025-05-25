import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaDumbbell, FaInfoCircle } from "react-icons/fa";

const EditWorkoutPage = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const memberUserId = location.state?.userId;
  const [formData, setFormData] = useState({
    order: "",
    workoutTypeId: "",
    workoutTypeTitle: "",           
    workoutTypeDescription: "",     
    intensity: "",
    series: "",
    repetitions: "",
    weight: "",
    rest: "",
    date: ""
  });

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/workouts/${workoutId}`, {
          withCredentials: true,
        });
        const workout = res.data.workout;
        setFormData({
          order: workout.order,
          workoutTypeId: workout.workoutType_id._id,
          workoutTypeTitle: workout.workoutType_id.title,
          workoutTypeDescription: workout.workoutType_id.description,
          intensity: workout.intensity,
          series: workout.series,
          repetitions: workout.repetitions,
          weight: workout.weight,
          rest: workout.rest,
          date: workout.date.split("T")[0], // formato YYYY-MM-DD
        });
      } catch (error) {
        console.error("Error al cargar workout:", error.response?.data || error.message);
      }
    };
    fetchWorkout();
  }, [workoutId]);

  useEffect(() => {
    const fetchWorkoutType = async () => {
      if (!formData.workoutTypeId) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/api/workout-types/${formData.workoutTypeId}?userId=${memberUserId}`,
          { withCredentials: true }
        );
        const workoutType = res.data;
        setFormData((prev) => ({
          ...prev,
          workoutTypeTitle: workoutType.title,
          workoutTypeDescription: workoutType.description,
        }));
      } catch (error) {
        console.error("Error al cargar el tipo de workout:", error.response?.data || error.message);
      }
    };
  
    fetchWorkoutType();
  }, [formData.workoutTypeId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
      const updatedData = {
        ...formData,
        intensity: Number(formData.intensity),
        series: Number(formData.series),
        repetitions: Number(formData.repetitions),
        weight: Number(formData.weight),
        rest: Number(formData.rest),
        order: Number(formData.order),
      };


      await axios.put(
        `http://localhost:4000/api/workout-types/${formData.workoutTypeId}?userId=${memberUserId}`,
        {
          title: formData.workoutTypeTitle,
          description: formData.workoutTypeDescription,
        },
        { withCredentials: true }
      );
      console.log("Tipo de workout actualizado correctamente");
      

      await axios.put(
        `http://localhost:4000/api/workouts/${workoutId}?userId=${memberUserId}`,
        updatedData,
        { withCredentials: true }
      );
      

      alert("Workout actualizado correctamente");
      navigate("/my-workouts-by-day/" + formData.date, {
        state: memberUserId ? { userId: memberUserId } : undefined
      });
      
    } catch (err) {
        console.error("Error al actualizar el workout:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error al actualizar el workout");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">MODIFICAR EJERCICIO</h1>
        <form onSubmit={handleSubmit} className="bg-blue-100 rounded-3xl p-6 space-y-6">
          <InputField label="Orden" name="order" type="number" value={formData.order} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField
            label="Nombre"
            name="workoutTypeTitle"
            type="text"
            value={formData.workoutTypeTitle}
            onChange={handleChange}
            icon={<FaDumbbell />}
            required
            labelClassName="text-black font-semibold"
            />

            <div className="space-y-1">
                <label className="font-semibold">Descripción</label>
                <div className="relative">
                    <textarea
                    name="workoutTypeDescription"
                    value={formData.workoutTypeDescription}
                    onChange={handleChange}
                    maxLength={200}
                    className="w-full rounded-full py-3 px-4 resize-none focus:outline-none"
                    required
                />
                <FaInfoCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
                <p className="text-right text-sm font-medium">máx. 200 caractéres</p>
            </div>
          <InputField label="Intensidad" name="intensity" type="number" value={formData.intensity} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField label="Series" name="series" type="number" value={formData.series} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField label="Repeticiones" name="repetitions" type="number" value={formData.repetitions} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField label="Peso (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField label="Descanso (seg)" name="rest" type="number" value={formData.rest} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <InputField label="Fecha" name="date" type="date" value={formData.date} onChange={handleChange} required labelClassName="text-black font-semibold" />
          <div className="text-center pt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-full">GUARDAR CAMBIOS</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditWorkoutPage;