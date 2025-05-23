import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { FaUser, FaLock, FaEnvelope, FaCamera } from "react-icons/fa";

function RegisterTrainerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "trainer") {
      alert("Acceso denegado");
      navigate("/");
    }
  }, [navigate]);

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

      const payload = { ...formData, photo: imageUrl };

      await axios.post("http://localhost:4000/api/register", payload, {
        withCredentials: true,
      });

      alert("Entrenador registrado con éxito");
      navigate("/");
    } catch (error) {
      alert("Error al registrar: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Registro de Entrenador</h1>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Campos del formulario */}
          <input type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
          <input type="text" name="classesCanTeach" placeholder="Clases que puede impartir" value={formData.classesCanTeach} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Registrar</button>
        </form>
      </main>
    </div>
  );
}

export default RegisterTrainerPage;
