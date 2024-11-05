// src/components/Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col text-center">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
       ProjectTask
      </div>
      <nav className="flex-1 p-4 space-y-4 ">
        <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700">
          Inicio
        </Link>
        <Link to="/dashboard/projects" className="block p-2 rounded hover:bg-gray-700">
          Proyectos
        </Link>
        <Link to="/dashboard/tasks" className="block p-2 rounded hover:bg-gray-700">
          Tareas
        </Link>

        
        
      </nav>
      <Link to="/dashboard/settings" className="p-4 mt-auto bg-blue-600 hover:bg-blue-700 w-full text-center">
          Ver Perfil
        </Link>
      <button
        onClick={handleLogout}
        className="p-4 mt-auto bg-red-600 hover:bg-red-700 w-full text-center"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Sidebar;
