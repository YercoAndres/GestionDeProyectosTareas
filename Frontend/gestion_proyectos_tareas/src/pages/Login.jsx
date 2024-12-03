// FILE: Login.jsx
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/api/auth/login`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
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
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2  justify-center items-center bg-cyan-950  px-4 md:px-0">
        <div className="w-full max-w-md mx-auto md:ml-32">
          <form onSubmit={handleLogin} className="bg-gray-100 shadow-md rounded-3xl px-8 md:px-14 py-10 mb-8 ">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-950">Inicio de Sesión</h2>
            <div className="mb-4">
              <label className="block text-indigo-950 text-sm font-bold mb-2" htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-blue-500"
                required
              />

            </div>
            <div className="mb-6">
              <label className="block text-indigo-950 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-md appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-blue-500"
              required
            />

            </div>
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline">
                Iniciar Sesión
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-200">
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
        <div className="hidden lg:block w-full h-full ">
          <img src="../assets/fondo.png" alt="Login" loading="Lazy" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}


export default Login;