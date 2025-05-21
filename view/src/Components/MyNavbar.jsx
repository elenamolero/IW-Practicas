import React from "react";
import { FaUser } from "react-icons/fa";

function MyNavbar() {
  return (
    <nav className="bg-black text-white flex justify-between items-center px-8 py-6">
      <span className="font-bold text-2xl">GYMPRO</span>
      <div className="flex gap-24 text-lg">
        <a href="#" className="hover:text-gray-300">Home</a>
        <a href="#" className="hover:text-gray-300">Mi Rutina</a>
        <a href="#" className="hover:text-gray-300">Clases Grupales</a>
        <a href="#" className="hover:text-gray-300">Sala de musculación</a>
      </div>
      <FaUser className="text-2xl" />
    </nav>
  );
}

export default MyNavbar;