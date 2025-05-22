import React from "react";
import { FaUser } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePageSettings = () => {
  const { user, isAuthenticated, logout: logoutFromContext } = useAuth();
  const navigate = useNavigate();


const handleReceiptsNavigation = () => {
  navigate("/my-invoices"); // Asegúrate de que esta ruta coincida con la definida en tu router
};

const handleLogout = async () => {

    try {
      await axios.post("http://localhost:4000/api/logout", {}, { withCredentials: true });
      logoutFromContext();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar sesión.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar tu suscripción? Esta acción es irreversible.")) return;

    try {
      await axios.delete(`http://localhost:4000/api/delete-user/${user.email}`, {
        withCredentials: true
      });

      alert("Tu cuenta ha sido eliminada correctamente.");
      logoutFromContext();
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("Hubo un error al cancelar la suscripción.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-lg text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />

      <main className="flex flex-col items-center px-6 py-12">
        <h1 className="text-5xl font-semibold mb-10">PERFIL</h1>

        {/* Imagen y datos */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-40 h-40 border-4 border-gray-300 rounded-lg flex items-center justify-center">
            {user.photo ? (
              <img src={user.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <FaUser className="text-6xl text-gray-400" />
              </div>
            )}
          </div>

          <div className="text-left space-y-2 text-lg">
            <p><span className="font-semibold text-gray-800">Nombre:</span> {user.firstName}</p>
            <p><span className="font-semibold text-gray-800">Apellidos:</span> {user.lastName}</p>
            <p><span className="font-semibold text-gray-800">Correo:</span> {user.email}</p>
            <div className="flex gap-8 mt-4 text-lg">
              <p><span className="font-semibold text-gray-800">Peso:</span> {user.weight || "-"}</p>
              <p><span className="font-semibold text-gray-800">Altura:</span> {user.height || "-"}</p>
            </div>
          </div>
        </div>

        {/* Botones de acciones */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition">
            modificar datos
          </button>

          <button
            onClick={handleDeleteAccount}
            className="border border-red-500 text-red-500 px-4 py-2 rounded-full hover:bg-red-100 transition"
          >
            cancelar suscripción
          </button>

          <button
           onClick={handleReceiptsNavigation}
           className="border border-green-600 text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition"
          >consultar recibos
          </button>

          <button
            onClick={handleLogout}
            className="border border-black text-black px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            cerrar sesión
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePageSettings;
