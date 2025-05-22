import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCamera, FaChalkboardTeacher, FaPlus, FaMinus } from "react-icons/fa";
import InputField from "../Components/InputField";
import axios from "axios";

function RegisterTrainerPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    photo: null,
    classes: [""]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleClassChange = (idx, value) => {
    setFormData((prev) => {
      const updated = [...prev.classes];
      updated[idx] = value;
      return { ...prev, classes: updated };
    });
  };

  const addClass = () => {
    setFormData((prev) => ({ ...prev, classes: [...prev.classes, ""] }));
  };

  const removeClass = (idx) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== idx)
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "foto-perfil");
    data.append("cloud_name", "drpq61jfx");

    const res = await axios.post("https://api.cloudinary.com/v1_1/drpq61jfx/image/upload", data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      if (formData.photo) {
        imageUrl = await uploadImageToCloudinary(formData.photo);
      }

      const trainerToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        classes: formData.classes.filter((c) => c.trim() !== ""),
        photo: imageUrl || undefined,
        role: "trainer"
      };

      await axios.post("http://localhost:3000/api/register-trainer", trainerToSend, {
        withCredentials: true
      });

      alert("Entrenador registrado correctamente");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        photo: null,
        classes: [""]
      });
    } catch (error) {
      console.error("Error al registrar entrenador:", error.response?.data || error.message);
      alert("Hubo un error al registrar el entrenador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src="/Fondo.jpg"
          alt="Fondo de pesas"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Contenido */}
      <div className="z-10 w-full max-w-md px-8 mt-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          ¿Quieres ser entrenador?
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
          <InputField label="Nombre" name="firstName" type="text" placeholder="Tu nombre" icon={<FaUser />} value={formData.firstName} onChange={handleChange} required />
          <InputField label="Apellidos" name="lastName" type="text" placeholder="Tus apellidos" icon={<FaUser />} value={formData.lastName} onChange={handleChange} required />
          <InputField label="Correo" name="email" type="email" placeholder="email@example.com" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} required />
          <InputField label="Contraseña" name="password" type="password" placeholder="********" icon={<FaLock />} value={formData.password} onChange={handleChange} required />
          <InputField label="Repetir contraseña" name="confirmPassword" type="password" placeholder="********" icon={<FaLock />} value={formData.confirmPassword} onChange={handleChange} required />
          <InputField label="Teléfono" name="phone" type="text" placeholder="Tu teléfono" icon={<FaPhone />} value={formData.phone} onChange={handleChange} />

          {/* Foto */}
          <div>
            <label className="block mb-1 font-medium">Foto de perfil</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-full file:cursor-pointer"
              />
              <FaCamera className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Clases que puede impartir */}
          <div>
            <label className="block mb-1 font-medium">Clases que puede impartir</label>
            {formData.classes.map((clase, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <InputField
                  name={`class-${idx}`}
                  type="text"
                  placeholder="Nombre de la clase"
                  icon={<FaChalkboardTeacher />}
                  value={clase}
                  onChange={(e) => handleClassChange(idx, e.target.value)}
                  required
                />
                {formData.classes.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeClass(idx)}
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="flex items-center text-blue-500 hover:text-blue-700 mt-1"
              onClick={addClass}
            >
              <FaPlus className="mr-1" /> Añadir clase
            </button>
          </div>

          {/* Botón */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-full transition"
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGISTRAR ENTRENADOR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterTrainerPage;