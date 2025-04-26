import React from "react";

export default function Header() {
  return (
    <header className="md:fixed top-0 w-full bg-cyan-950 text-white z-50">
      <nav className="flex flex-col md:flex-row justify-between items-center  px-5">
        <a href="/">
          <img src="../assets/icon.png" alt="icon" className="w-20 h-full" />
        </a>
        <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 mt-3 md:mt-0">
          <li className="hover:bg-cyan-700 px-4 py-2 mb-2 rounded-md transition duration-300 ease-in-out ">
            <a href="/login" className="text-xl">
              Iniciar Sesión
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
