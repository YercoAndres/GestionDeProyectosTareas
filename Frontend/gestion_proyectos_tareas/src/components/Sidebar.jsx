import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Home,
  Folder,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { useLoading } from "../contexts/LoadingContext";
import { useTheme } from "../contexts/ThemeContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/dashboard/projects", label: "Proyectos", icon: Folder },
];

const Sidebar = ({ children }) => {
  const { set: setLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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

  const isLight = theme === "light";

  const renderLinks = () => (
    <>
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setIsOpen(false)}
          className={`nav-link rounded-full px-4 py-2 text-sm font-semibold ${
            location.pathname === to ? "nav-link-active" : ""
          }`}
        >
          <span className="font-medium">{label}</span>
        </Link>
      ))}
      <Link
        to="/dashboard/settings"
        onClick={() => setIsOpen(false)}
        className="nav-link rounded-full px-4 py-2 text-sm font-semibold"
      >
        Perfil
      </Link>
    </>
  );

  return (
    <div className="min-h-screen transition-colors duration-300">
      <header className="nav-shell fixed inset-x-0 top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src="../assets/icon.png"
              alt="ProjectTask icon"
              className="h-10 w-10 rounded-2xl border p-2 shadow-lg"
              style={{
                borderColor: "var(--surface-border)",
                background: "var(--surface-muted)",
              }}
            />
            <div>
              <p
                className="text-xs uppercase tracking-[0.35em]"
                style={{ color: "var(--nav-muted)" }}
              >
                ProjectTask
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--nav-text)" }}
              >
                Gestion colaborativa
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">{renderLinks()}</nav>

          <div className="hidden items-center gap-3 text-sm font-semibold md:flex">
            <button
              onClick={toggleTheme}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition"
              style={{
                borderColor: "var(--surface-border)",
                background: "var(--surface-muted)",
                color: "var(--nav-text)",
              }}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 transition"
              style={{
                borderColor: "var(--surface-border)",
                color: "var(--nav-text)",
              }}
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center rounded-full border p-2 md:hidden"
            style={{
              borderColor: "var(--surface-border)",
              background: "var(--surface-muted)",
              color: "var(--nav-text)",
            }}
          >
            <Menu size={20} />
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>

        {isOpen && (
          <div className="nav-shell border-t px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">{renderLinks()}</div>
            <button
              onClick={toggleTheme}
              className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{
                borderColor: "var(--surface-border)",
                color: "var(--nav-text)",
              }}
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
              Modo {isLight ? "oscuro" : "claro"}
            </button>
            <button
              onClick={handleLogout}
              className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{
                borderColor: "var(--surface-border)",
                color: "var(--nav-text)",
              }}
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>
        )}
      </header>

      <main className="pt-24">{children}</main>
    </div>
  );
};

export default Sidebar;
