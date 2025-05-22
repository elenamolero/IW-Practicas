import React, { useState } from "react";
import { FaUser, FaEnvelope, FaWeight, FaRulerVertical, FaCreditCard, FaCamera } from "react-icons/fa";
import InputField from "./InputField";
import axios from "axios";

function EditProfileForm({ userData, onUpdate }) {
    const [formData, setFormData] = useState({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        weight: userData.weight || "",
        height: userData.height || "",
        bankAccount: userData.bankAccount || "",
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

        try {
            let imageUrl = formData.photo ? await uploadImageToCloudinary(formData.photo) : userData.photo;

            const userToUpdate = {
                ...formData,
                weight: Number(formData.weight),
                height: Number(formData.height),
                photo: imageUrl
            };

            const res = await axios.put("http://localhost:4000/api/profile", userToUpdate, {
                withCredentials: true
            });

            console.log("Perfil actualizado:", res.data);
            onUpdate(res.data);
            alert("Perfil actualizado correctamente");

        } catch (error) {
            console.error("Error al actualizar perfil:", error.response?.data || error.message);
            alert("Hubo un error al actualizar el perfil");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        <img
                            src={userData.photo || "https://via.placeholder.com/150"}
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                        <FaCamera />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    label="Nombre"
                    name="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    icon={<FaUser />}
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <InputField
                    label="Apellidos"
                    name="lastName"
                    type="text"
                    placeholder="Tus apellidos"
                    icon={<FaUser />}
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <InputField
                    label="Correo"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    icon={<FaEnvelope />}
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Peso (kg)"
                    name="weight"
                    type="number"
                    placeholder="Tu peso"
                    icon={<FaWeight />}
                    value={formData.weight}
                    onChange={handleChange}
                />
                <InputField
                    label="Altura (cm)"
                    name="height"
                    type="number"
                    placeholder="Tu altura"
                    icon={<FaRulerVertical />}
                    value={formData.height}
                    onChange={handleChange}
                />
                <InputField
                    label="Cuenta bancaria"
                    name="bankAccount"
                    type="text"
                    placeholder="Tu cuenta bancaria"
                    icon={<FaCreditCard />}
                    value={formData.bankAccount}
                    onChange={handleChange}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
                Guardar cambios
            </button>
        </form>
    );
}

export default EditProfileForm; 