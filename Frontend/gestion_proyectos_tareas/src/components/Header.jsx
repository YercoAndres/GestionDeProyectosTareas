import React from 'react';

export default function Header() {
  return (
    <header className="md:fixed top-0 w-full bg-cyan-900 text-white z-50">
      <nav className="flex flex-col md:flex-row justify-between items-center py-3 px-5">
        
        {/* Logo */}
        <img src="../public/icon.png" alt="icon" className="w-14 h-full" />

        {/* Navigation Links */}
        <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 mt-3 md:mt-0">
          <li className="hover:bg-cyan-800 px-4 py-2 rounded-md transition duration-300 ease-in-out">
            <a href="/login">Iniciar Sesión</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
