import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { useAuth } from "../Context/AuthContext";

function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [myGroupClasses, setMyGroupClasses] = useState([]);
    const [currentGymReservations, setCurrentGymReservations] = useState(0);


    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/my-upcoming-group-classes", {
                    withCredentials: true
                });
                setMyGroupClasses(res.data.classes);
            } catch (error) {
                console.error("Error al obtener tus clases:", error);
            }
            setLoading(false);
        };

        const fetchCurrentGymReservations = async () => {
          try {
              const res = await axios.get("http://localhost:4000/api/current-gym-reservations", {
                  withCredentials: true
              });
              setCurrentGymReservations(res.data.count);
          } catch (error) {
              console.error("Error al obtener el aforo del gimnasio:", error);
          }
      };

        fetchMyClasses();
        fetchCurrentGymReservations();

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Obtener la fecha actual en formato YYYY-MM-DD
    const currentDate = new Date().toISOString().split("T")[0];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black pt-20">
            <Navbar />

            {/* CONTENIDO */}
            <main className="px-8 py-12 text-center">
                {/* TÍTULO */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    {isAuthenticated && user?.firstName
                        ? `Bienvenid@ de nuevo ${user.firstName}`
                        : "Bienvenid@"}
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
                        <p className="text-3xl font-bold">{currentGymReservations} socios</p>
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