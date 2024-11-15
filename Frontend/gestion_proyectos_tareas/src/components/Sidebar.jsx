import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex">
      <div className="md:hidden">
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
        } md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-2xl font-bold text-center">ProjectTask</h2>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
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
          <h2 className="hidden md:block p-4 text-2xl font-bold border-b border-gray-700">
            ProjectTask
          </h2>
          <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link
            to="/dashboard/projects"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Proyectos
          </Link>
          <Link
            to="/dashboard/tasks"
            className="block p-2 rounded hover:bg-gray-700"
          >
            Tareas
          </Link>
        </nav>
        <Link
          to="/dashboard/settings"
          className="p-4 mt-auto bg-blue-600 hover:bg-blue-700 w-full text-center"
        >
          Ver Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="p-4 mt-auto bg-red-600 hover:bg-red-700 w-full text-center"
        >
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
