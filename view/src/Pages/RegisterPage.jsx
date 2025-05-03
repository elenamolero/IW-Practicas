import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaRulerVertical, FaWeight, FaCreditCard, FaCamera } from "react-icons/fa"; // Asegurate de tener react-icons instalado
import InputField from "../Components/InputField";
import axios from "axios";



function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        bankAccount: "",
        weight: "",
        height: "",
        role: "member", // por defecto
        photo: null
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
            photo: imageUrl || undefined // si no hay imagen, no se envía
          };
          console.log('Datos enviados al backend:', userToSend);

          // Ya no usamos FormData ni multipart
          const res = await axios.post("http://localhost:4000/api/register", userToSend, {
            withCredentials: true
          });
      
          console.log("Usuario creado:", res.data);
          alert("Usuario registrado correctamente");
    
        } catch (error) {
          console.error("Error al registrar:", error.response?.data || error.message);
          alert("Hubo un error al registrar");
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
          <div className="z-10 w-full max-w-md px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
              ¿Estás listo para <br /> comenzar tu cambio?
            </h1>
    
            <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
                <InputField label="Nombre" name="firstName" type="text" placeholder="Tu nombre" icon={<FaUser />} value={formData.firstName} onChange={handleChange} />
                <InputField label="Apellidos" name="lastName" type="text" placeholder="Tus apellidos" icon={<FaUser />} value={formData.lastName} onChange={handleChange} />
                <InputField label="Correo" name="email" type="email" placeholder="email@example.com" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} />
                <InputField label="Contraseña" name="password" type="password" placeholder="********" icon={<FaLock />} value={formData.password} onChange={handleChange} />
                <InputField label="Repetir contraseña" name="confirmPassword" type="password" placeholder="********" icon={<FaLock />} value={formData.confirmPassword} onChange={handleChange} />
                <InputField label="Cuenta bancaria" name="bankAccount" type="text" placeholder="ES00 0000 0000 0000" icon={<FaCreditCard />} value={formData.bankAccount} onChange={handleChange} />
                <InputField label="Peso (kg)" name="weight" type="number" placeholder="70" icon={<FaWeight />} value={formData.weight} onChange={handleChange} />
                <InputField label="Altura (cm)" name="height" type="number" placeholder="170" icon={<FaRulerVertical />} value={formData.height} onChange={handleChange} />

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
    
              {/* Botón */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-3 px-8 rounded-full transition"
                >
                  INSCRIBIRSE
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}

export default RegisterPage;