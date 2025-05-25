import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import { FaSearch } from "react-icons/fa";

const TrainerRoutinesPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/members", {
          withCredentials: true,
        });
        setMembers(res.data);
      } catch (err) {
        console.error("Error al obtener miembros:", err);
        alert("Error al obtener la lista de socios");
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) =>
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleModify = (memberId) => {
  const today = new Date().toISOString().split("T")[0];
  navigate(`/member-workouts-by-day/${memberId}/${today}`);
};

  return (
    <div className="min-h-screen bg-white text-black pt-20 px-6">
      <Navbar />
      <h1 className="text-center text-4xl font-bold mb-10">RUTINAS</h1>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Introduce el correo de socio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 pl-6 pr-12 rounded-full bg-gray-100 focus:outline-none"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        {filteredMembers.map((member) => (
          <div
            key={member.email}
            className="bg-gray-50 px-6 py-4 rounded-lg flex justify-between items-center"
          >
            <span className="text-lg font-medium text-[#072F5D]">
              {member.email}
            </span>
            <button
                onClick={() => handleModify(member._id)}
                className="text-blue-500 hover:underline"
            >
            modificar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerRoutinesPage;