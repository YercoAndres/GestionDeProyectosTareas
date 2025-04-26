import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Home, Folder, User, LogOut  } from 'lucide-react';
import { useLoading } from '../contexts/LoadingContext';

const Sidebar = ({ children }) => {
  const { set: setLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    toast.success('Sesión cerrada correctamente');
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="flex">
      <div className="  bg-cyan-950">
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
          aria-controls="sidebar"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } 4xl:translate-x-0 transition-transform duration-300 ease-in-out bg-cyan-950 text-white w-64 flex flex-col`}
      >
         
        <div className="flex items-center justify-end">
          
        <h2 className="p-4 text-2xl font-bold border-b border-gray-700">
            ProjectTask
          </h2>
          
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-4">
        
          
          <Link to="/dashboard" className="block p-2 rounded hover:bg-cyan-700 "
          >
            <Home size={24} className="inline-block mr-3 " />
            Dashboard
          </Link>
          <Link
            to="/dashboard/projects"
            className="block p-2 rounded hover:bg-cyan-700 "
          >
            <Folder size={24} className="inline-block mr-3 " />
            Proyectos
          </Link>
          {/* <Link
            to="/dashboard/tasks"
            className="block p-2 rounded hover:bg-cyan-700"
          >
            Tareas
          </Link> */}
        </nav>
        
        <Link
        
          to="/dashboard/settings"
          className="p-4 mt-auto block rounded  border-t border-gray-700 hover:bg-cyan-700 "
        >
          <User size={24} className="inline-block mr-3 " />
          Ver Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="p-4 mt-auto block rounded  text-start text-red-600 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={24} className="inline-block mr-3 " />
          Cerrar Sesión
        </button>
      </div>

      <div className="flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
