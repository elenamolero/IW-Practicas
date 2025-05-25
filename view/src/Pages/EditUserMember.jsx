import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";

const EditUserMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    fetchMemberById,
    updateMember,
    memberError,
  } = useAuth();

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

  useEffect(() => {
    fetchMemberById(id)
      .then((data) => {
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          bankAccount: data.bankAccount || "",
          weight: data.weight || "",
          height: data.height || "",
        });
        setUserRole(data.role || "member");
      })
      .catch(() => {
        alert("No se pudo cargar el usuario");
        navigate("/user-manager");
      });
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPayload = {
      ...formData,
      weight: Number(formData.weight),
      height: Number(formData.height),
      role: userRole,
      _id: id,
    };

    try {
      await updateMember(updatedPayload);
      alert("Datos actualizados correctamente");
      navigate("/user-manager");
    } catch (err) {
      alert(
        memberError ||
        (err.response?.data?.message ||
          (Array.isArray(err.response?.data)
            ? err.response.data.join(", ")
            : "Error al actualizar el usuario"))
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />
      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-10">MODIFICAR USUARIO</h1>
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