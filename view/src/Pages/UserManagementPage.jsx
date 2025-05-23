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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "trainer") {
      alert("Acceso denegado");
      navigate("/");
    }
  }, [navigate]);

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
          <FaSearch className="ml-4 text-gray-500" />
        </div>

        {/* Lista de usuarios */}
        <ul>
          {filteredUsers.map((user) => (
            <li key={user._id} className="py-2 border-b">
              {user.email}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default UserManagementPage;
