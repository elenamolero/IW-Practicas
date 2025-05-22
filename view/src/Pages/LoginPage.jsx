import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import InputField from "../Components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";


function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { signin, isAuthenticated, errors } = useAuth(); 
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin(formData);
    };

    useEffect(() => {
        if (isAuthenticated) {
          navigate("/profile");
        }
      }, [isAuthenticated, navigate]);

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
                    ¡Bienvenido de nuevo!
                </h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-60 p-6 rounded-2xl space-y-6">
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
                        label="Contraseña" 
                        name="password" 
                        type="password" 
                        placeholder="********" 
                        icon={<FaLock />} 
                        value={formData.password} 
                        onChange={handleChange} 
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Iniciar sesión
                    </button>

                    <p className="text-center text-gray-300">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">
                            Regístrate aquí
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
  