import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom"; // Importa useParams
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";
import ResendTokenAuth from "../components/ResendTokenAuth";

function ConfirmAccount() {
  const { token } = useParams(); // Obtén el token desde la URL
  const [code, setCode] = useState("");
  const { set: setLoading } = useLoading();
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/confirm-account/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error en la solicitud");
      } else {
        toast.success("Cuenta confirmada con éxito");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Error al confirmar la cuenta");
    }

    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 min-h-screen w-full items-center justify-center  bg-slate-100 ">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleConfirm}
          className="bg-slate-50 shadow-2xl rounded-xl px-8 md:px-14 py-10 mb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Confirma tu cuenta
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Código de confirmación
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^\d{0,6}$/.test(newValue)) {
                  setCode(newValue);
                }
              }}
              className="shadow border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700  focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
              placeholder="Escribe el código de confirmación"
              maxLength={6}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl  focus:outline-none focus:shadow-outline"
            >
              Confirmar
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 ">
            ¿No has recibido el código?
            <ResendTokenAuth />
          </p>
          <p className="text-black">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-black font-bold hover:text-blue-500"
            >
              Ingresa aquí
            </Link>
          </p>

          <Link to="/" className="text-black0 font-bold hover:text-blue-500">
            Ir al menú principal
          </Link>
        </div>
      </div>
      <div className="hidden lg:block w-full h-full bg-black"> </div>
    </div>
  );
}

export default ConfirmAccount;
