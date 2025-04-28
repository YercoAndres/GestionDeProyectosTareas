import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResendTokenAuth({ email }) {
  const handleResendToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error al reenviar el token");
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Ingresa tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="shadow-md appearance-none border border-gray-300 rounded-lg m-2 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
      />

      <button
        onClick={handleResendToken}
        className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl  focus:outline-none focus:shadow-outline"
      >
        Reenviar Código
      </button>
    </div>
  );
}
