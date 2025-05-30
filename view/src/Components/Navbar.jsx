import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); 

  useEffect(() => {
    console.log("Usuario en Navbar:", user);
  }, [user]);

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
    navigate(`/group-classes-by-day/${today}`, { state: { user } });
    if (window.location.pathname === `/group-classes-by-day/${today}`) {
      window.location.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white flex justify-between items-center px-8 py-4 m-0">
      <span className="font-bold text-xl">GYMPRO</span>
      <div className="flex gap-6">
        <a
          href="/profile"
          className="hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile");
            if (window.location.pathname === "/profile") {
              window.location.reload();
            }
          }}
        >
          Home
        </a>
        {user?.role === "trainer" ? (
          <a
          href="/trainer-routines"
          className="hover:text-gray-300"
          onClick={(e) => {
          e.preventDefault();
          navigate("/trainer-routines");
          if (window.location.pathname === "/trainer-routines") {
            window.location.reload();
          }
        }}
        >
        Rutinas
        </a>
        ) : (
        <a
          href={`/my-workouts-by-day/${new Date().toISOString().split("T")[0]}`}
          className="hover:text-gray-300"
          onClick={handleRutinaClick}
        >
        Mi Rutina
        </a>
        )}
        <a
          href={`/group-classes-by-day/${new Date().toISOString().split("T")[0]}`}
          className="hover:text-gray-300"
          onClick={handleGroupClassesClick}
        >
          Clases Grupales
        </a>

        {/*  Aquí se muestra un enlace u otro según el rol */}
        {user?.role === "trainer" ? (
          <a
            href="/user-manager"
            className="hover:text-gray-300"
            onClick={(e) => {
              e.preventDefault();
              navigate("/user-manager");
              if (window.location.pathname === "/user-manager") {
                window.location.reload();
              }
            }}
          >
            Gestor de usuarios
          </a>
        ) : (
          <a
            href="/muscle-room"
            className="hover:text-gray-300"
            onClick={(e) => {
            e.preventDefault();
            navigate("/muscle-room");
            }}
          >
            Sala de musculación
          </a>
        )}
      </div>

      <div className="flex items-center gap-2">
        <FaUser className="text-2xl" />
        {isAuthenticated && user && (
          <button
            onClick={() => navigate("/profile-settings")}
            className="text-sm font-semibold hover:underline"
          >
            {user.firstName || user.username || "Usuario"}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;