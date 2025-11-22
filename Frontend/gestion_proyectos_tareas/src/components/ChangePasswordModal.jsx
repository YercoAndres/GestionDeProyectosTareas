import React, { useState } from "react";
import { toast } from "react-toastify";
import Modal from "./Modal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MIN_PASSWORD_LENGTH = 6;

export default function ChangePasswordModal({ userId, onClose }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    if (passwords.newPassword.length < MIN_PASSWORD_LENGTH) {
      toast.error(
        `La nueva contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      );
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Las contrasenas no coinciden.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePasswords()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No hay sesion activa.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/users/${userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo cambiar la contrasena.");
      }

      toast.success(data.message || "Contrasena cambiada correctamente.");
      onClose();
    } catch (error) {
      console.error("Error al cambiar la contrasena:", error);
      toast.error(error.message || "No se pudo cambiar la contrasena.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cambiar contrasena"
      buttonText={submitting ? "Guardando..." : "Guardar cambios"}
      onClose={onClose}
      onSubmit={submitting ? undefined : handleSubmit}
    >
      <div className="space-y-4">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Contrasena actual
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/70"
            autoComplete="current-password"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Nueva contrasena
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/70"
            autoComplete="new-password"
          />
        </label>
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Confirmar nueva contrasena
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-slate-300/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/70"
            autoComplete="new-password"
          />
        </label>
      </div>
    </Modal>
  );
}
