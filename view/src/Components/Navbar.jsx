import React from "react";
import { FaUser } from "react-icons/fa";

const Navbar = ({ currentDate }) => (
  <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white flex justify-between items-center px-8 py-4 m-0">
    <span className="font-bold text-xl">GYMPRO</span>
    <div className="flex gap-6">
      <a href="#" className="hover:text-gray-300">Home</a>
      <a href={`/my-workouts-by-day/${currentDate}`} className="hover:text-gray-300">Mi Rutina</a>
      <a href="#" className="hover:text-gray-300">Clases Grupales</a>
      <a href="#" className="hover:text-gray-300">Sala de musculación</a>
    </div>
    <FaUser className="text-2xl" />
  </nav>
);

export default Navbar;