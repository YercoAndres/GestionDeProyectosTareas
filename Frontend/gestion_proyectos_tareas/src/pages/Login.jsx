import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

// Funcion para logear
  const handleLogin = async (e) => {
    e.preventDefault();    

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Con el body le pasamos lo que ingresan en el formulario al backend
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
        // Mensaje de inicio de sesion
        toast.success('Inicio de sesión exitoso');
        // Se redirige al dasboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
        } catch (error) {
          toast.error(error.message);
        }
  };

  return (
    <>
      <ToastContainer />
      <div className="grid md:grid-cols-2 sm:grid-cols-1 min-h-screen w-full items-center justify-center  bg-slate-100 ">
        <div className="w-full max-w-md mx-auto">
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
           
            <Link className=" font-bold hover:text-blue-500"> ¿Olvidaste tu contraseña?</Link>
            <p className="text-black">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className=" text-black font-bold hover:text-blue-500">
                Regístrate aquí
              </Link>
            </p>
            <Link to="/" className="font-bold hover:text-blue-500">
              Ir al menú principal
            </Link>
          </div>
        </div>
         <div className="hidden lg:block w-full h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 to-indigo-900"> </div> 
      </div>
    </>
  );
}

export default Login;