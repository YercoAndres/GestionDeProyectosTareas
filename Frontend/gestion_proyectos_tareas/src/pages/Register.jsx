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
    
    
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 justify-center items-center bg-gray-100 px-4 md:px-0">
      <div className="w-full max-w-md mx-auto md:ml-32">
        <form onSubmit={handleRegister} className="bg-white shadow-md rounded px-8 py-6">
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"'>
              <option value="">Selecciona un rol</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Registrar
            </button>
          </div>
        </form> 
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-500 font-bold hover:text-blue-700">
              Ingresa aquí
            </Link>
          </p>

            <Link to="/" className="text-blue-500 font-bold hover:text-blue-700">
             Ir al menú principal
              </Link>
        </div>
      </div>
      <div className="hidden md:block w-full h-full ">
    <img src="../public/login.png" alt="Login" className="w-full h-full" />
     </div>
    </div>

  );
}

export default Register;
