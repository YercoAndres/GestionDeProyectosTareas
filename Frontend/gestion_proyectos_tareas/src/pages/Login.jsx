// FILE: Login.jsx
import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/login', {
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
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2  justify-center items-center bg-gray-100 px-4 md:px-0">
        <div className="w-full max-w-md mx-auto md:ml-32">
          <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 md:px-14 py-10">
            <h2 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>
            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Iniciar Sesión
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="text-blue-500 font-bold hover:text-blue-700">
                Regístrate aquí
              </Link>
           
            </p>
            <Link to="/" className="text-blue-500 font-bold hover:text-blue-700">
             Ir al menú principal
              </Link>
          </div>
        </div>
        <div className="hidden lg:block w-full h-full ">
          <img src="../public/login.png" alt="Login" loading="Lazy" className="w-full h-full" />
        </div>
      </div>
    </>
  );
}

export default Login;