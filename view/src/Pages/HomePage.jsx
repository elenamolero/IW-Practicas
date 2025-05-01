import React from "react";
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <nav className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <span className="font-bold text-white text-lg">GYMPRO</span>
        <Link to="/login" className="text-white text-sm">Iniciar sesión</Link>
      </nav>

      <div className="absolute inset-0 z-0">
        <img
          src="/Fondo.jpg"
          alt="Fondo de pesas"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <main className="z-10 text-center px-4">
        <h1 className="text-9xl font-bold mb-4">GYMPRO</h1>
        <h2 className="text-3xl tracking-wide mb-8">CÓRDOBA ES FITNESS</h2>

        <div className="bg-gray-800 bg-opacity-60 rounded-xl px-6 py-4 inline-block mb-6">
          <span className="text-6xl font-semibold">
            a tan sólo <span className="text-red-500 font-bold">26.99€</span>
          </span>
        </div>

        <div>
          <Link to="/register" className="bg-blue-400 hover:bg-blue-500 text-black text-3xl font-semibold py-3 px-8 rounded-full">
            INSCRÍBETE
          </Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;