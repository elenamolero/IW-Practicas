import React, { useState, useEffect } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/members", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <Navbar />

      <main className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">GESTOR USUARIOS</h1>

        {/* Campo de búsqueda */}
        <div className="flex items-center justify-center mb-8">
          <input
            type="text"
            placeholder="Introduce el correo de socio..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full max-w-md px-6 py-3 rounded-full bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          <FaSearch className="ml-[-2rem] text-gray-500" />
        </div>

        {/* Lista de usuarios */}
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center bg-gray-100 px-6 py-3 rounded"
            >
              <span className="text-lg text-gray-800">{user.email}</span>
              <button
                onClick={() => navigate(`/edit-user/${user._id}`)}
                className="text-blue-600 font-medium hover:underline"
              >
                Editar Perfil
              </button>
            </li>
          ))}
        </ul>

        {/* Botón nuevo entrenador */}
        <div className="flex justify-end mt-10">
          <button
            onClick={() => navigate("/register-trainer")}
            className="flex items-center gap-2 bg-blue-300 hover:bg-blue-400 text-white px-6 py-3 rounded-full text-lg font-semibold shadow"
          >
            <FaUserPlus />
            Nuevo Entrenador
          </button>
        </div>
      </main>
    </div>
  );
}

export default UserManagementPage;
