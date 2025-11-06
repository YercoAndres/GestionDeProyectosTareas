import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Home, Folder, User, LogOut, Menu } from "lucide-react";
import { useLoading } from "../contexts/LoadingContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/dashboard/projects", label: "Proyectos", icon: Folder },
];

const Sidebar = ({ children }) => {
  const { set: setLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    toast.success("Sesion cerrada correctamente");
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen">
      <button
        onClick={toggleMenu}
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-full border border-white/20 bg-slate-900/70 p-3 text-slate-100 shadow-lg backdrop-blur transition hover:border-cyan-300 hover:text-white md:hidden"
        aria-controls="sidebar"
        aria-expanded={isOpen}
      >
        <Menu size={20} />
        <span className="sr-only">Abrir menu</span>
      </button>

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950/85 px-6 py-8 text-slate-100 shadow-2xl backdrop-blur transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="../assets/icon.png"
              alt="ProjectTask icon"
              className="h-10 w-10 rounded-2xl border border-white/15 bg-white/80 p-2 shadow-lg"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                ProjectTask
              </p>
              <p className="text-sm font-semibold text-white">
                Gestion colaborativa
              </p>
            </div>
          </Link>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-300 hover:text-white md:hidden"
          >
            <Menu size={18} />
            <span className="sr-only">Cerrar menu</span>
          </button>
        </div>

        <nav className="mt-10 flex-1 space-y-2 text-sm font-medium">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-white"
            >
              <Icon size={18} className="text-cyan-200 transition group-hover:text-white" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t border-white/10 pt-5 text-sm font-medium">
          <Link
            to="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-slate-200 transition hover:border-indigo-300/40 hover:bg-indigo-500/10 hover:text-white"
          >
            <User size={18} className="text-indigo-200" />
            Ver perfil
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-rose-300 transition hover:border-rose-300/40 hover:bg-rose-500/10 hover:text-rose-100"
          >
            <LogOut size={18} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-72">{children}</div>
    </div>
  );
};

export default Sidebar;
