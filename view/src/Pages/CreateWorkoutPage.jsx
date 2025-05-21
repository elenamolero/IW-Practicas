// import React, { useState } from "react";
// import Navbar from "../Components/Navbar";
// import axios from "axios";
// import { FaCamera } from "react-icons/fa";
// import InputField from "../Components/InputField"; // Ajusta la ruta si está en otro lugar

// function CreateWorkoutPage() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     intensity: "",
//     series: "",
//     repetitions: "",
//     rest: "",
//     weight: ""
    
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
      

//       const workoutToSend = {
//         ...formData,
//         series: Number(formData.series),
//         repetitions: Number(formData.repetitions),
//         rest: Number(formData.rest),
//         weight: Number(formData.weight),
//         image: imageUrl || undefined
//       };

//       const res = await axios.post("http://localhost:4000/api/workouts", workoutToSend, {
//         withCredentials: true
//       });

//       console.log("Workout creado:", res.data);
//       alert("Workout creado correctamente");

//       setFormData({
//         title: "",
//         description: "",
//         intensity: "",
//         series: "",
//         repetitions: "",
//         rest: "",
//         weight: "",
//         image: null
//       });
//     } catch (error) {
//       console.error("Error al crear workout:", error.response?.data || error.message);
//       alert("Hubo un error al crear el workout");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-white text-black">
//       <Navbar />

//       {/* Contenido */}
//       <div className="z-10 w-full max-w-md px-8 mt-20">
//         <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
//           Crea tu Workout
//         </h1>

//         <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
//           <InputField
//             label="Título"
//             name="title"
//             type="text"
//             placeholder="Título del workout"
//             value={formData.title}
//             onChange={handleChange}
//           />

//           {/* Descripción: no usa InputField porque es un textarea */}
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
//             type="text"
//             placeholder="Baja, media o alta"
//             value={formData.intensity}
//             onChange={handleChange}
//           />

//           <InputField
//             label="Series"
//             name="series"
//             type="number"
//             placeholder="Número de series"
//             value={formData.series}
//             onChange={handleChange}
//           />

//           <InputField
//             label="Repeticiones"
//             name="repetitions"
//             type="number"
//             placeholder="Número de repeticiones"
//             value={formData.repetitions}
//             onChange={handleChange}
//           />

//           <InputField
//             label="Descanso (segundos)"
//             name="rest"
//             type="number"
//             placeholder="Tiempo de descanso"
//             value={formData.rest}
//             onChange={handleChange}
//           />

//           <InputField
//             label="Peso (kg)"
//             name="weight"
//             type="number"
//             placeholder="Peso utilizado"
//             value={formData.weight}
//             onChange={handleChange}
//           />

          
         

//           {/* Botón */}
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

function CreateWorkoutPage() {
  // Estado con los campos requeridos. Nota: usamos "workoutTypeId" para capturar
  // el título del tipo de workout que luego se creará y del cual obtenemos su _id.
  const [formData, setFormData] = useState({
    order: "",
    workoutTypeId: "", // Se usará como título para crear el tipo de workout
    description: "",
    intensity: "",
    series: "",
    repetitions: "",
    weigh: "", // se convertirá en 'weigh'
    rest: "",
    date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para crear el tipo de workout y retornar su id
  const createWorkoutTypeAndGetId = async (title) => {
    try {
      // Puedes ajustar el description que envías según necesites. En este ejemplo se envía vacío.
      const titleNormalized = title.trim();
      const res = await axios.post(
        "http://localhost:4000/api/create-workout-type",
        { title, description: "Tipo creado desde CreateWorkoutPage" },
        { withCredentials: true }
      );
      return res.data.workoutType._id;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error al crear el tipo de workout"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Primero crea el workout type y obtén su id
      const newWorkoutTypeId = await createWorkoutTypeAndGetId(formData.workoutTypeId);

      // Luego prepara el objeto para crear el workout
      const workoutToSend = {
        order: Number(formData.order),
        workoutTypeId: newWorkoutTypeId, // Utiliza el _id del workout type creado
        description: formData.description,
        intensity: Number(formData.intensity),
        series: Number(formData.series),
        repetitions: Number(formData.repetitions),
        weigh: Number(formData.weigh), // conversión de weight a weigh
        rest: Number(formData.rest),
        date: formData.date // Debe estar en formato ISO, e.g., "2025-05-21T00:00:00"
      };

      // Llamada al endpoint de creación del workout
      const res = await axios.post("http://localhost:4000/api/create-workout", workoutToSend, {
        withCredentials: true
      });

      console.log("Workout creado:", res.data);
      alert("Workout creado correctamente");

      // Limpiar el formulario
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
    } catch (error) {
      console.error("Error al crear workout:", error.response?.data || error.message);
      alert("Hubo un error al crear el workout, revisa la consola.");
    }
  };

  

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <Navbar />
      <div className="z-10 w-full max-w-md px-8 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Crea tu Workout
        </h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
          <InputField
            label="Orden"
            name="order"
            type="number"
            placeholder="Orden del workout"
            value={formData.order}
            onChange={handleChange}
            required
          />
          <InputField
            label="Nombre (Título Tipo Workout)"
            name="workoutTypeId"
            type="text"
            placeholder="Título del tipo de workout"
            value={formData.workoutTypeId}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block mb-1 text-white font-medium">Descripción</label>
            <textarea
              name="description"
              placeholder="Descripción del workout"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-white text-black"
              required
            />
          </div>
          <InputField
            label="Intensidad"
            name="intensity"
            type="number"
            placeholder="Entre 1 y 10"
            value={formData.intensity}
            onChange={handleChange}
            required
          />
          <InputField
            label="Series"
            name="series"
            type="number"
            placeholder="Número de series"
            value={formData.series}
            onChange={handleChange}
            required
          />
          <InputField
            label="Repeticiones"
            name="repetitions"
            type="number"
            placeholder="Número de repeticiones"
            value={formData.repetitions}
            onChange={handleChange}
            required
          />
          <InputField
            label="Peso (kg)"
            name="weight"
            type="number"
            placeholder="Peso utilizado"
            value={formData.weight}
            onChange={handleChange}
            required
          />
          <InputField
            label="Descanso (segundos)"
            name="rest"
            type="number"
            placeholder="Tiempo de descanso"
            value={formData.rest}
            onChange={handleChange}
            required
          />
          <InputField
            label="Fecha (ISO)"
            name="date"
            type="text"
            placeholder="2025-05-21T00:00:00"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-full transition"
            >
              CREAR WORKOUT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkoutPage;