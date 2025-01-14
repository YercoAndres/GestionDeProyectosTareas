import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud');
      }

      const data = await response.json();

      if (data.user && data.user.id) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id); // Almacena el ID del usuario
        toast.success('Inicio de sesión exitoso');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error('Error: Datos del usuario no encontrados');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen w-full  bg-gradient-to-b from-gray-700 via-gray-900 to-black ">
        <div className="w-full max-w-lg  ">
          <form onSubmit={handleLogin} className="bg-slate-50 shadow-2xl rounded-xl px-8 md:px-14 py-10 mb-8 ">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">Inicio de Sesión</h2>
            <div className="mb-4">
              <label className="block text-slate-900 text-sm font-bold mb-2" htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
                placeholder="Escribe tu correo"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-indigo-950 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-md appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
                placeholder="Escribe tu contraseña"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl  focus:outline-none focus:shadow-outline">
                Iniciar Sesión
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
           
            <Link className="text-emerald-400 font-bold hover:text-emerald-500"> ¿Olvidaste tu contraseña?</Link>
            <p className="text-slate-200">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-emerald-400 font-bold hover:text-emerald-500">
                Regístrate aquí
              </Link>
            </p>
            <Link to="/" className="text-emerald-400 font-bold hover:text-emerald-500">
              Ir al menú principal
            </Link>
          </div>
        </div>
        {/* <div className="hidden lg:block w-full h-full ">
          <img src="../assets/fondo.png" alt="Login" loading="Lazy" className="w-full h-full" />
        </div> */}
      </div>
    </>
  );
}

export default Login;