import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import InputField from "../Components/InputField";
import { FaUser, FaLock, FaEnvelope, FaPlus, FaTrash } from "react-icons/fa";
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
    classesCanTeach: [],
    newClass: "",
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
        classesCanTeach: Array.isArray(user.classesCanTeach) ? user.classesCanTeach : [],
        newClass: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Para añadir una clase a la lista
  const handleAddClass = (e) => {
    e.preventDefault();
    const newClass = formData.newClass.trim();
    if (newClass && !formData.classesCanTeach.includes(newClass)) {
      setFormData((prev) => ({
        ...prev,
        classesCanTeach: [...prev.classesCanTeach, newClass],
        newClass: "",
      }));
    }
  };

  // Para eliminar una clase de la lista
  const handleRemoveClass = (className) => {
    setFormData((prev) => ({
      ...prev,
      classesCanTeach: prev.classesCanTeach.filter((c) => c !== className),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPayload = {
      ...formData,
      role: user.role,
    };

    if (user.role === "member") {
      updatedPayload.weight = Number(formData.weight);
      updatedPayload.height = Number(formData.height);
      delete updatedPayload.classesCanTeach;
      delete updatedPayload.newClass;
    }

    if (user.role === "trainer") {
      updatedPayload.classesCanTeach = formData.classesCanTeach;
      delete updatedPayload.weight;
      delete updatedPayload.height;
      delete updatedPayload.bankAccount;
      delete updatedPayload.newClass;
    }

    try {
      const res = await axios.put("http://localhost:4000/api/update", updatedPayload, {
        withCredentials: true,
      });

      alert("Datos actualizados correctamente");
      setUser(res.data);
      navigate("/profile-settings");
    } catch (err) {
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
              <div>
                <label className="block font-semibold mb-1">
                  Clases que puede impartir
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="newClass"
                    value={formData.newClass}
                    onChange={handleChange}
                    className="rounded-full px-4 py-2 flex-1"
                    placeholder="Añadir clase..."
                  />
                  <button
                    onClick={handleAddClass}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center"
                    type="button"
                  >
                    <FaPlus className="mr-1" /> Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.classesCanTeach.map((className, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full flex items-center"
                    >
                      {className}
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveClass(className)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
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