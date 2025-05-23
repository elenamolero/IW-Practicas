import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bankAccount: "",
    weight: "",
    height: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bankAccount: user.bankAccount || "",
        weight: user.weight || "",
        height: user.height || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedPayload = {
      ...formData,
      role: user.role,
    };
  
    // Asegurar que los campos requeridos tengan el tipo correcto
    if (user.role === "member") {
      updatedPayload.weight = Number(formData.weight);
      updatedPayload.height = Number(formData.height);
    }
  
    // Mostrar los datos en consola antes de enviarlos
    console.log("Payload que se enviará al backend:", updatedPayload);
    console.log("Tipos:", {
        weight: typeof updatedPayload.weight,
        height: typeof updatedPayload.height,
      });
  
    try {
      const res = await axios.put("http://localhost:4000/api/update", updatedPayload, {
        withCredentials: true,
      });
  
      alert("Datos actualizados correctamente");
      setUser(res.data);
      navigate("/profile-settings");
    } catch (err) {
        console.log("Error completo:", err.response?.data);
      alert(err.response?.data?.message || "Error al actualizar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">MODIFICAR DATOS</h1>
        <form onSubmit={handleSubmit} className="bg-blue-100 rounded-3xl p-6 space-y-6">
          <InputField
            label="*Nombre"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            icon={<FaUser />}
            required
          />
          <InputField
            label="*Apellidos"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            icon={<FaLock />}
            required
          />
          <InputField
            label="*Correo"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={<FaEnvelope />}
            required
            disabled
          />

          {/* Mostrar campos adicionales según el rol */}
          {user.role === "member" && (
            <>
              <InputField
                label="Peso (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
              <InputField
                label="Altura (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
              />
              <InputField
                label="Cuenta bancaria"
                name="bankAccount"
                type="text"
                value={formData.bankAccount}
                onChange={handleChange}
              />
              <InputField
                label="Teléfono"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          {user.role === "trainer" && (
            <>
              <InputField
                label="Teléfono"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-2 rounded-full"
            >
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditUserPage;
