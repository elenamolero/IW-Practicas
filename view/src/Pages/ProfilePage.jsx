import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaWeight, FaRulerVertical, FaCreditCard } from "react-icons/fa";

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [myGroupClasses, setMyGroupClasses] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/profile", {
                    withCredentials: true
                });
                setUserData(res.data);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
            }
        };


        const fetchMyClasses = async () => {
            try {
              const res = await axios.get("http://localhost:4000/api/my-upcoming-group-classes", {
                withCredentials: true
              });
              console.log("Datos recibidos de /my-upcoming-group-classes:", res.data);
              setMyGroupClasses(res.data.classes);
              console.log("obtiene las clases futuras")
            } catch (error) {
              console.error("Error al obtener tus clases:", error);
            }
          };

        const fetchAll = async () => {
            await fetchUserData();
            await fetchMyClasses();
            setLoading(false); 
          };
        
          fetchAll();

        const interval = setInterval(() => {
            setCurrentTime(new Date());
          }, 1000); // actualiza cada segundo
        
        return () => clearInterval(interval);
        
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="bg-black text-white flex justify-between items-center px-8 py-4">
        <span className="font-bold text-xl">GYMPRO</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300">Home</a>
          <a href="/my-workouts-by-day/2025-04-30"  className="hover:text-gray-300">Mi Rutina</a>
          <a href="#" className="hover:text-gray-300">Clases Grupales</a>
          <a href="#" className="hover:text-gray-300">Sala de musculación</a>
        </div>
        <FaUser className="text-2xl" />
      </nav>

      {/* CONTENIDO */}
      <main className="px-8 py-12 text-center">
        {/* TÍTULO */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Bienvenid@ de nuevo {userData?.firstName || "Usuario"}
        </h1>

        {/* INFORMACIÓN CENTRAL */}
        <div className="flex flex-col md:flex-row justify-around items-center gap-12 mt-10">
          {/* GIMNASIO */}
          <div>
            <h2 className="text-2xl font-semibold">GYMPRO Córdoba Centro</h2>
          </div>

          {/* AFORO */}
          <div>
            <h2 className="text-xl font-semibold">AFORO ACTUAL RESERVADO</h2>
            <p className="text-3xl font-bold">80 socios</p>
            <p className="text-sm text-red-600 mt-1">*aforo máx. 200 personas</p>
          </div>
        </div>

        {/* PRÓXIMA RESERVA */}
        <div className="mt-16 text-left max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Tus próximas clases:</h3>
            {myGroupClasses.length > 0 ? (
            <ul className="space-y-3">
            {myGroupClasses.map((cls) => (
            <li key={cls._id} className="bg-gray-100 p-4 rounded-lg shadow">
                <div className="text-lg font-semibold">{cls.name}</div>
                <div className="text-sm text-gray-700">
                    {new Date(cls.schedule).toLocaleString('es-ES', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </div>
                <div className="text-sm text-gray-600">
                Entrenador: {cls.assignedTrainer?.firstName || "No asignado"}
                </div>
            </li>
            ))}
            </ul>
            ) : (
            <p className="text-gray-500">No tienes clases reservadas todavía.</p>
            )}
        </div>

        {/* RELOJ */}
        <div className="mt-12 inline-block bg-gray-100 px-10 py-6 rounded-xl shadow-md">
        <p className="text-5xl font-mono mb-2">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-xl font-semibold">
            {currentTime.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
            })}
        </p>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage; 