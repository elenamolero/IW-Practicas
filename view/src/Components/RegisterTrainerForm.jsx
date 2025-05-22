import { useState } from "react";
import { registerTrainer } from "../api/auth";

const initialState = {
  nombre: "",
  apellidos: "",
  email: "",
  password: "",
  telefono: "",
  foto: null,
  clases: [""],
};

export default function RegisterTrainerForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else if (name.startsWith("clases")) {
      const idx = parseInt(name.split("-")[1]);
      const updated = [...form.clases];
      updated[idx] = value;
      setForm({ ...form, clases: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addClase = () => {
    setForm({ ...form, clases: [...form.clases, ""] });
  };

  const removeClase = (idx) => {
    const updated = form.clases.filter((_, i) => i !== idx);
    setForm({ ...form, clases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "clases") {
          value.forEach((v) => formData.append("clases[]", v));
        } else if (key === "foto" && value) {
          formData.append("foto", value);
        } else {
          formData.append(key, value);
        }
      });
      await registerTrainer(formData);
      setSuccess("Entrenador registrado correctamente");
      setForm(initialState);
    } catch (err) {
      setError("Error al registrar entrenador");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-bold mb-4">Registrar nuevo entrenador</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      <input
        className="input input-bordered w-full mb-2"
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered w-full mb-2"
        type="text"
        name="apellidos"
        placeholder="Apellidos"
        value={form.apellidos}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered w-full mb-2"
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered w-full mb-2"
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered w-full mb-2"
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={form.telefono}
        onChange={handleChange}
      />
      <input
        className="file-input file-input-bordered w-full mb-2"
        type="file"
        name="foto"
        accept="image/*"
        onChange={handleChange}
      />
      <label className="block font-semibold mb-1">Clases que puede impartir:</label>
      {form.clases.map((clase, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            className="input input-bordered flex-1"
            type="text"
            name={`clases-${idx}`}
            value={clase}
            onChange={handleChange}
            required
          />
          {form.clases.length > 1 && (
            <button
              type="button"
              className="btn btn-error btn-xs ml-2"
              onClick={() => removeClase(idx)}
            >
              Quitar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn btn-secondary btn-sm mb-4"
        onClick={addClase}
      >
        Añadir clase
      </button>
      <button className="btn btn-primary w-full" type="submit">
        Registrar entrenador
      </button>
    </form>
  );
}