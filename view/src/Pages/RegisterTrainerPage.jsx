import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { FaUser, FaLock, FaEnvelope, FaCamera } from "react-icons/fa";

function RegisterTrainerPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bankAccount: "",
    weight: "",
    height: "",
    role: "trainer",
    photo: null,
    classesCanTeach: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
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

    try {
      let imageUrl = "";

      if (formData.photo) {
        imageUrl = await uploadImageToCloudinary(formData.photo);
      }

      const userToSend = {
        ...formData,
        weight: Number(formData.weight),
        height: Number(formData.height),
        photo: imageUrl || undefined,
      };

      // Elimina la propiedad si está vacía
      if (!formData.classesCanTeach || formData.classesCanTeach.trim() === "") {
        delete userToSend.classesCanTeach;
      }

      const res = await axios.post("http://localhost:4000/api/register", userToSend, {
        withCredentials: true,
      });

      console.log("Usuario creado:", res.data);
      alert("Entrenador registrado correctamente");
      navigate("/user-manager");
    } catch (error) {
      console.error("Error al registrar:", error.response?.data || error.message);
      alert("Hubo un error al registrar");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">NUEVO ENTRENADOR</h1>
        <form onSubmit={handleSubmit} className="bg-blue-100 rounded-3xl p-6 space-y-6">
          <div className="relative">
            <label className="block font-semibold mb-1">Nombre*</label>
            <div className="flex items-center rounded-full bg-white">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-full focus:outline-none"
              />
              <FaUser className="mr-4" />
            </div>
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Apellidos*</label>
            <div className="flex items-center rounded-full bg-white">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-full focus:outline-none"
              />
              <FaUser className="mr-4" />
            </div>
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Correo*</label>
            <div className="flex items-center rounded-full bg-white">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-full focus:outline-none"
              />
              <FaEnvelope className="mr-4" />
            </div>
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Contraseña*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-full px-4 py-2"
            />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Repetir contraseña*</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-full px-4 py-2"
            />
          </div>

          <div className="relative">
            <label className="block font-semibold mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-full px-4 py-2"
            />
          </div>

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

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-8 py-2 rounded-full"
            >
              Registrar Nuevo Entrenador
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default RegisterTrainerPage;