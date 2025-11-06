import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Modal from "./Modal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLE_OPTIONS = [
  { value: "user", label: "Miembro de equipo" },
  { value: "manager", label: "Project manager" },
];

export default function EditProfileModal({ user, setUser, onClose }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role || "user",
  });
  const [saving, setSaving] = useState(false);

  const formFields = useMemo(
    () => [
      {
        label: "Nombre completo",
        name: "name",
        type: "text",
        placeholder: "Tu nombre",
      },
      {
        label: "Correo electronico",
        name: "email",
        type: "email",
        placeholder: "tu@empresa.com",
      },
    ],
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Nombre y correo son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el perfil.");
      }

      setUser((prev) => ({
        ...prev,
        ...formData,
      }));
      toast.success("Perfil actualizado correctamente.");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Editar perfil"
      buttonText={saving ? "Guardando..." : "Guardar cambios"}
      onClose={onClose}
      onSubmit={saving ? undefined : handleSave}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {formFields.map((field) => (
            <label
              key={field.name}
              className="space-y-2 text-sm font-semibold text-slate-700"
            >
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/70"
                autoComplete={field.name === "email" ? "email" : "name"}
              />
            </label>
          ))}
        </div>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Rol asignado
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/70"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </Modal>
  );
}
