import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Caracteristicas", href: "#features" },
  { label: "Equipo", href: "#aboutinfo" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <nav className="glass-panel flex items-center justify-between rounded-2xl px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="../assets/icon.png"
              alt="ProjectTask icon"
              className="h-10 w-10 rounded-xl border border-white/20 bg-white/80 p-1 shadow-lg"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.35em] text-slate-300">
                ProjectTask
              </span>
              <span className="text-lg font-semibold text-white">
                Gestion de proyectos
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-6 text-sm font-medium tracking-wide text-slate-200">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-all duration-200 hover:text-white hover:opacity-90"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/register" className="secondary-button">
              Crear cuenta
            </Link>
          </div>

          <Link to="/login" className="primary-button md:ml-8">
            Iniciar sesion
          </Link>
        </nav>
      </div>
    </header>
  );
}
