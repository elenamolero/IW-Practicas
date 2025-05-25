import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaUser, FaLock, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { getMemberByIdRequest, updateUserMemberRequest } from "../api/auth";

const EditUserMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bankAccount: "",
    weight: "",
    height: "",
  });
  const [userRole, setUserRole] = useState("member");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        console.log("Solicitando datos de miembro con id:", id);
        const res = await getMemberByIdRequest(id);
        console.log("Respuesta del backend:", res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          bankAccount: res.data.bankAccount || "",
          weight: res.data.weight || "",
          height: res.data.height || "",
        });
        setUserRole(res.data.role || "member");
      } catch (err) {
        setError("No se pudo cargar el usuario");
        setTimeout(() => setError(null), 4000);
        navigate("/user-manager");
      }
    };
    fetchMember();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const updatedPayload = {
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height),
      role: userRole,
      _id: id,
    };
    console.log("Enviando payload para actualizar:", updatedPayload);
    try {
      await updateUserMemberRequest(updatedPayload);
      setSuccess(true);
      setTimeout(() => {
        navigate("/user-manager");
      }, 2000); // 2 segundos de notificación antes de redirigir
    } catch (err) {
      if (Array.isArray(err.response?.data)) {
        setError(err.response.data.join(", "));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al actualizar el usuario");
      }
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">MODIFICAR USUARIO</h1>
        {/* Notificación bonita de éxito */}
        {success && (
          <div className="bg-green-500 text-white rounded-lg px-4 py-2 mb-2 text-center font-semibold flex items-center justify-center gap-2">
            <FaCheckCircle className="text-xl" /> ¡Usuario actualizado correctamente! Redirigiendo...
          </div>
        )}
        {/* Notificación bonita de errores */}
        {error && (
          <div className="bg-red-500 text-white rounded-lg px-4 py-2 mb-4 text-center font-semibold">
            {error}
          </div>
        )}
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

export default EditUserMemberPage;