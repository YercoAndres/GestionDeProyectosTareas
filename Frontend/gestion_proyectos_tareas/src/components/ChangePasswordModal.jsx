import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ChangePasswordModal({ userId, onClose }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    if (passwords.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay sesión activa");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/change-password`,
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
        throw new Error(data.message || "Error al cambiar la contraseña");
      }

      toast.success(data.message);
      onClose();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error(error.message);
    }
    toast.success("Contraseña cambiada exitosamente");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña Actual
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
