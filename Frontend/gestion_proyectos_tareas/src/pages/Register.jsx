import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('');
  const navigate = useNavigate();
 


  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!role) {
      toast.error('Por Favor selecciona un rol');
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
      toast.success('Usuario registrado de forma correcta, por favor revisa tu correo para verificar tu cuenta', {
        autoClose: 5000,
      });
      navigate('/'); 
    } else {
      toast.error(data.message, {
        autoClose: 5000,
      });
    }
  };
  

  return (
    
    
<div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-b from-gray-700 via-gray-900 to-black ">
  <div className="w-full max-w-md">
    <form onSubmit={handleRegister} className="bg-gray-100 shadow-md rounded-xl px-8 md:px-14 py-10 mb-8">
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
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
          required
          placeholder="Escribe tu nombre"
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
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
          required
          placeholder="Escribe tu correo"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Contraseña
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
          required
          placeholder="Escribe tu contraseña"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeat-password">
          Repite tu Contraseña
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="repeat-password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="shadow appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
          placeholder="Escribe tu contraseña nuevamente"
          required
        />
      </div>

      {password && repeatPassword && password !== repeatPassword && (
        <p className="text-red-500 font-bold text-sm mb-3">Las contraseñas no coinciden.</p>
      )}

      <div className="mb-3">
        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring focus:ring-blue-200 mr-1"
        />
        Mostrar contraseña
      </div>

      <div className="mb-6">
        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
          Rol
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          id="role"
          className="shadow appearance-none border border-gray-300 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 focus:ring-blue-500"
        >
          <option value="" className="text-gray-600">Selecciona un rol</option>
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
</div>


  );
}

export default Register;
