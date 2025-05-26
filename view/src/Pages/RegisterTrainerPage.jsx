import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/AuthContext";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import InputField from "../Components/InputField";

function RegisterTrainerPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); 

  // Si necesitas el ID para pasarlo a otra ruta o a la API
  const memberUserId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "trainer")) {
      alert("Acceso denegado");
      navigate("/");
    }
  }, [user, authLoading, navigate]);

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

      const payload = { 
        ...formData, 
        photo: imageUrl || null,
        weight: formData.role === "member" && formData.weight ? Number(formData.weight) : undefined,
        height: formData.role === "member" && formData.height ? Number(formData.height) : undefined,
        bankAccount: formData.role === "member" && formData.bankAccount ? formData.bankAccount : undefined,
        classesCanTeach: formData.role === "trainer" ? [] : undefined,
      };
      console.log("Payload enviado:", payload);

      await axios.post("http://localhost:4000/api/register-trainer", payload, {
        withCredentials: true,
      });

      alert("Entrenador registrado con éxito");
      navigate("/user-manager");
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      alert("Error al registrar: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
    <Navbar />
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Registrar Entrenador</h1>
      <form onSubmit={handleSubmit} className="bg-blue-100 rounded-3xl p-6 space-y-6 shadow-md">
        <InputField
          label="Nombre"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaUser />}
        />
        <InputField
          label="Apellido"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaUser />}
        />
        <InputField
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaEnvelope />}
        />
        <InputField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaLock />}
        />
        <InputField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaLock />}
        />
        <InputField
          label="Teléfono"
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          required
          labelClassName="text-black font-semibold"
          icon={<FaPhone />}
        />

        {/* Foto */}
        <div className="space-y-1">
          <label className="font-semibold text-black">Foto de perfil</label>
          <div className="relative">
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full cursor-pointer transition"
            >
              <FaCamera />
              Subir foto
            </label>
            {formData.photo && (
              <p className="mt-2 text-sm text-gray-700">
                Foto seleccionada: {formData.photo.name}
              </p>
            )}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-full"
          >
            REGISTRAR ENTRENADOR
          </button>
        </div>
      </form>
    </main>
  </div>
);
}

export default RegisterTrainerPage;
