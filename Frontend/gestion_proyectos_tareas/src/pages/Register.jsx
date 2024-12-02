import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

  if(!role){
    toast.error('Por Favor selecciona un rol')
    return;
  }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Usuario registrado de forma correcta'),{
        autoClose: 5000
      }
      navigate('/login');
    } else {
      toast.error(data.message),{
        autoClose: 5000
      };
    }
  };

  return (
    
    
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 justify-center items-center bg-cyan-950 px-4 md:px-0">
      <div className="w-full max-w-md mx-auto md:ml-32">
        <form onSubmit={handleRegister} className="bg-gray-100 shadow-md rounded-3xl px-8 md:px-14 py-10 mb-8 ">
          <h2 className="text-2xl font-bold text-center mb-6">Registrate</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo
            </label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="rol" className='block text-gray-700 text-sm font-bold mb-2'>
              Rol
            </label>
            <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            id="role"
            className='shadow appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 focus:ring-blue-500"'>
              <option value="">Selecciona un rol</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-xl transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline"
            >
              Registrar
            </button>
          </div>
        </form> 
        <div className="mt-4 text-center">
          <p className="text-white">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-500">
              Ingresa aquí
            </Link>
          </p>

            <Link to="/" className="text-emerald-400 font-bold hover:text-emerald-500">
             Ir al menú principal
              </Link>
        </div>
      </div>
      <div className="hidden lg:block w-full h-full ">
      <img src="../public/assets/fondo.png" alt="Login" loading="Lazy" className="w-full h-full" />
     </div>
    </div>

  );
}

export default Register;
