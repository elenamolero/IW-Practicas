
// import React, { useState } from "react";
// import Navbar from "../Components/Navbar";
// import axios from "axios";
// import InputField from "../Components/InputField";

// function CreateWorkoutPage() {
//   // Estado con los campos requeridos. Nota: usamos "workoutTypeId" para capturar
//   // el título del tipo de workout que luego se creará y del cual obtenemos su _id.
//   const [formData, setFormData] = useState({
//     order: "",
//     workoutTypeId: "", // Se usará como título para crear el tipo de workout
//     description: "",
//     intensity: "",
//     series: "",
//     repetitions: "",
//     weigh: "", // se convertirá en 'weigh'
//     rest: "",
//     date: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Función para crear el tipo de workout y retornar su id
//   const createWorkoutTypeAndGetId = async (title) => {
//     try {
//       // Puedes ajustar el description que envías según necesites. En este ejemplo se envía vacío.
//       const titleNormalized = title.trim();
//       const res = await axios.post(
//         "http://localhost:4000/api/create-workout-type",
//         { title, description: "Tipo creado desde CreateWorkoutPage" },
//         { withCredentials: true }
//       );
//       return res.data.workoutType._id;
//     } catch (error) {
//       throw new Error(
//         error.response?.data?.message || "Error al crear el tipo de workout"
//       );
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Valida que se haya ingresado un valor válido para "weigh"
//   if (!formData.weigh || Number(formData.weigh) < 1) {
//     return alert("Por favor ingresa un valor para Peso (kg) mayor o igual a 1.");
//   }
//     try {
//       // Primero crea el workout type y obtén su id
//       const newWorkoutTypeId = await createWorkoutTypeAndGetId(formData.workoutTypeId);

//       // Luego prepara el objeto para crear el workout
//       const workoutToSend = {
//         order: Number(formData.order),
//         workoutTypeId: newWorkoutTypeId, // Utiliza el _id del workout type creado
//         description: formData.description,
//         intensity: Number(formData.intensity),
//         series: Number(formData.series),
//         repetitions: Number(formData.repetitions),
//         weigh: Number(formData.weigh), // conversión de weight a weigh
//         rest: Number(formData.rest),
//         date: formData.date // Debe estar en formato ISO, e.g., "2025-05-21T00:00:00"
//       };

//       // Llamada al endpoint de creación del workout
//       const res = await axios.post("http://localhost:4000/api/create-workout", workoutToSend, {
//         withCredentials: true
//       });

//       console.log("Workout creado:", res.data);
//       alert("Workout creado correctamente");

//       // Limpiar el formulario
//       setFormData({
//         order: "",
//         workoutTypeId: "",
//         description: "",
//         intensity: "",
//         series: "",
//         repetitions: "",
//         weigh: "",
//         rest: "",
//         date: ""
//       });
//     } catch (error) {
//       console.error("Error al crear workout:", error.response?.data || error.message);
//       alert("Hubo un error al crear el workout, revisa la consola.");
//     }
//   };

  

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center bg-white text-black">
//       <Navbar />
//       <div className="z-10 w-full max-w-md px-8 mt-20">
//         <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
//           Crea tu Workout
//         </h1>
//         <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
//           <InputField
//             label="Orden"
//             name="order"
//             type="number"
//             placeholder="Orden del workout"
//             value={formData.order}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Nombre (Título Tipo Workout)"
//             name="workoutTypeId"
//             type="text"
//             placeholder="Título del tipo de workout"
//             value={formData.workoutTypeId}
//             onChange={handleChange}
//             required
//           />
//           <div>
//             <label className="block mb-1 text-white font-medium">Descripción</label>
//             <textarea
//               name="description"
//               placeholder="Descripción del workout"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full p-3 rounded bg-white text-black"
//               required
//             />
//           </div>
//           <InputField
//             label="Intensidad"
//             name="intensity"
//             type="number"
//             placeholder="Entre 1 y 10"
//             value={formData.intensity}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Series"
//             name="series"
//             type="number"
//             placeholder="Número de series"
//             value={formData.series}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Repeticiones"
//             name="repetitions"
//             type="number"
//             placeholder="Número de repeticiones"
//             value={formData.repetitions}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Peso (kg)"
//             name="weigh"
//             type="number"
//             placeholder="Peso utilizado"
//             value={formData.weigh}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Descanso (segundos)"
//             name="rest"
//             type="number"
//             placeholder="Tiempo de descanso"
//             value={formData.rest}
//             onChange={handleChange}
//             required
//           />
//           <InputField
//             label="Fecha (ISO)"
//             name="date"
//             type="text"
//             placeholder="2025-05-21T00:00:00"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//           <div className="text-center pt-4">
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-full transition"
//             >
//               CREAR WORKOUT
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default CreateWorkoutPage;

import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import InputField from "../Components/InputField";
import { FaDumbbell, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";

function CreateWorkoutPage() {
  // ======= Estado =========
  const [formData, setFormData] = useState({
    order: "",
    workoutTypeId: "", // título que luego se convierte en ID
    description: "",
    intensity: "",
    series: "",
    repetitions: "",
    weigh: "",
    rest: "",
    date: ""
  });

  // ======= Handlers =========
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para crear el tipo de workout y devolver su _id
  const createWorkoutTypeAndGetId = async (title) => {
    const titleTrim = title.trim();
    const res = await axios.post(
      "http://localhost:4000/api/create-workout-type",
      { title: titleTrim, description: "Tipo creado desde CreateWorkoutPage" },
      { withCredentials: true }
    );
    return res.data.workoutType._id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weigh || Number(formData.weigh) < 1)
      return alert("Peso (kg) debe ser ≥ 1");

    try {
      const newWorkoutTypeId = await createWorkoutTypeAndGetId(formData.workoutTypeId);

      const workoutToSend = {
        order: Number(formData.order),
        workoutTypeId: newWorkoutTypeId,
        description: formData.description,
        intensity: Number(formData.intensity),
        series: Number(formData.series),
        repetitions: Number(formData.repetitions),
        weigh: Number(formData.weigh),
        rest: Number(formData.rest),
        date: new Date(formData.date).toISOString()
      };

      await axios.post("http://localhost:4000/api/create-workout", workoutToSend, {
        withCredentials: true
      });

      alert("Workout creado correctamente");
      setFormData({
        order: "",
        workoutTypeId: "",
        description: "",
        intensity: "",
        series: "",
        repetitions: "",
        weigh: "",
        rest: "",
        date: ""
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al crear el workout");
    }
  };

  // ======= UI =========
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="z-10 w-full max-w-2xl px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-wider text-center mb-14">
          Crea tu Workout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-blue-100/80 rounded-3xl p-10 md:p-12 space-y-8 shadow-lg"
        >
          {/* ORDEN */}
          <InputField
            label="Orden"
            name="order"
            type="number"
            placeholder="Orden del ejercicio"
            value={formData.order}
            onChange={handleChange}
            required
          />

          {/* NOMBRE */}
          <InputField
            label="Nombre"
            name="workoutTypeId"
            placeholder="Título del tipo de ejercicio"
            value={formData.workoutTypeId}
            onChange={handleChange}
            icon={<FaDumbbell className="text-gray-500" />}
            required
          />

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <label className="font-semibold text-black">Descripción</label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del ejercicio (máx. 200)"
                maxLength={200}
                className="w-full rounded-full py-4 px-6 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                required
              />
              <FaInfoCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <p className="text-right text-sm font-medium text-gray-600">
              {formData.description.length}/200 caracteres
            </p>
          </div>

          {/* INTENSIDAD */}
          <div className="space-y-1">
            <label className="font-semibold text-black">Intensidad</label>
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
                <option key={n} className="text-black">{n}</option>
              ))}
            </select>
          </div>

          {/* GRID DE CAMPOS NUMÉRICOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Series"
              name="series"
              type="number"
              value={formData.series}
              onChange={handleChange}
              required
            />
            <InputField
              label="Repeticiones"
              name="repetitions"
              type="number"
              value={formData.repetitions}
              onChange={handleChange}
              required
            />
            <InputField
              label="Peso (kg)"
              name="weigh"
              type="number"
              value={formData.weigh}
              onChange={handleChange}
              required
            />
            <InputField
              label="Descanso (seg)"
              name="rest"
              type="number"
              value={formData.rest}
              onChange={handleChange}
              required
            />
          </div>

          {/* FECHA */}
          <InputField
            label="Fecha"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            icon={<FaCalendarAlt className="text-gray-500" />}
            required
          />

          {/* BOTÓN */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg px-12 py-4 rounded-full transition"
            >
              CREAR ENTRENAMIENTO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutPage;

