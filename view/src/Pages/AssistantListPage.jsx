import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./Styles/AssistantsListPage.css";

function AssistantListPage() {
  const { id } = useParams();
  const [groupClass, setGroupClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupClass = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/group-class-details/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setGroupClass(data.class);
      } catch (error) {
        console.error("Error al cargar la clase grupal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClass();
  }, [id]);

  if (loading) return <div className="p-4 pt-20">Cargando...</div>;
  if (!groupClass) return <div className="p-4 pt-20">Clase no encontrada.</div>;

const {
  name,
  schedule,
  maxCapacity,
  attendees = [],
  difficultyLevel,
  description,
  assignedTrainer = {} 
} = groupClass;

const difficultyStyles = {
  beginner: {
    emoji: "🟢",
    className: "difficulty-beginner",
    label: "Principiante"
  },
  intermediate: {
    emoji: "🟠",
    className: "difficulty-intermediate",
    label: "Intermedio"
  },
  advanced: {
    emoji: "🔥",
    className: "difficulty-advanced",
    label: "Avanzado"
  }
};

const difficulty = difficultyStyles[difficultyLevel] || {
  emoji: "⚪",
  className: "difficulty-unknown",
  label: "Desconocido"
};



  return (
    <div className="assistant-page pt-20">
      <Navbar />
      <div className="content">
        <h1 className="title">LISTA ASISTENTES</h1>
        <h2 className="class-name">{name}</h2>
        <p className="class-time">
          {new Date(schedule).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
          {new Date(new Date(schedule).getTime() + 45 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <div className="class-details">
<span className={`intensity ${difficulty.className}`}>INTENSIDAD: {difficulty.label}{difficulty.emoji} </span>
  <span className="capacity">CAPACIDAD: {maxCapacity} personas</span>
  <span className="assignedTrainer">ENTRENADOR@: {assignedTrainer?.email || "No asignado"} </span>
        </div>

        <p className="description">{description}</p>

        <h3 className="attendee-title">Asistentes:</h3>
        {attendees.length === 0 ? (
          <p>No hay asistentes registrados.</p>
        ) : (
          <ul className="attendee-list">
            {attendees.map((user, idx) => (
              <li key={idx} className="attendee-item">
                <span>{user.email || user.name || "Usuario"}</span>
                {idx === 0 && (
                  <button className="cancel-button">cancelar</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AssistantListPage;
