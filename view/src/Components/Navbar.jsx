import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); 

  console.log("Usuario en Navbar:", user);

  const handleRutinaClick = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    navigate(`/my-workouts-by-day/${today}`);
    if (window.location.pathname === `/my-workouts-by-day/${today}`) {
      window.location.reload();
    }
  };

  const handleGroupClassesClick = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    // Pasa el usuario como parámetro en el estado de navegación
    navigate(`/group-classes-by-day/${today}`, { state: { user } });
    if (window.location.pathname === `/group-classes-by-day/${today}`) {
      window.location.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white flex justify-between items-center px-8 py-4 m-0">
      <span className="font-bold text-xl">GYMPRO</span>
      <div className="flex gap-6">
        <a href="#" className="hover:text-gray-300">Home</a>
        <a
          href={`/my-workouts-by-day/${new Date().toISOString().split("T")[0]}`}
          className="hover:text-gray-300"
          onClick={handleRutinaClick}
        >
          Mi Rutina
        </a>
        <a
          href={`/group-classes-by-day/${new Date().toISOString().split("T")[0]}`}
          className="hover:text-gray-300"
          onClick={handleGroupClassesClick}
        >
          Clases Grupales
        </a>
        <a href="#" className="hover:text-gray-300">Sala de musculación</a>
      </div>
      <div className="flex items-center gap-2">
        <FaUser className="text-2xl" />
        {isAuthenticated && user && (
          <span className="text-sm font-semibold">{user.firstName || user.username || "Usuario"}</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;