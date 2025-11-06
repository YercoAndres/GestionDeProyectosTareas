import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoading } from "../contexts/LoadingContext";

const roles = [
  { value: "", label: "Selecciona un rol" },
  { value: "user", label: "Miembro de equipo" },
  { value: "manager", label: "Project manager" },
];

const benefits = [
  "Tableros colaborativos y vistas personalizadas.",
  "Asignacion de tareas con recordatorios automaticos.",
  "Reportes en tiempo real para decisiones informadas.",
];

function Register() {
  const { set: setLoading } = useLoading();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!name || !email || !password || !repeatPassword || !role) {
        toast.error("Completa todos los campos para continuar");
        return;
      }
      if (password !== repeatPassword) {
        toast.error("Las contrasenas no coinciden");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Registro exitoso. Revisa tu correo para confirmar la cuenta."
        );
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      toast.error("No pudimos registrar tu cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.35),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.35),transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-16 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="glass-panel hidden h-full flex-col justify-between rounded-3xl p-10 text-slate-100 shadow-2xl lg:flex">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200">
                Crea tu espacio
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Empieza a coordinar tu equipo con herramientas claras y modernas.
              </h1>
              <p className="mt-4 max-w-md text-sm text-slate-200/85">
                Define roles, establece objetivos y mantente alineado con el
                progreso de cada iniciativa desde un mismo tablero colaborativo.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-slate-200/90">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 p-4"
                >
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/90 text-[10px] font-bold text-cyan-950">
                    OK
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4 text-sm text-slate-200/90">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-200/90">
                  En minutos
                </p>
                <p>
                  Configura tu primer proyecto y comparte acceso con tu equipo
                  en solo tres pasos.
                </p>
              </div>
              <img
                src="../assets/icon.png"
                alt="ProjectTask icon"
                className="hidden h-16 w-16 rounded-3xl border border-white/10 bg-white/90 p-4 shadow-2xl lg:block"
              />
            </div>
          </div>

          <div className="glass-panel w-full rounded-3xl p-10 shadow-2xl">
            <div className="mb-10 space-y-3 text-center">
              <h2 className="text-3xl font-bold text-white">Crea tu cuenta</h2>
              <p className="text-sm text-slate-200/80">
                Completa los datos y empieza a trabajar de forma organizada hoy mismo.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Nombre completo
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Correo electronico
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                    placeholder="tu@empresa.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Contrasena
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                    placeholder="Minimo 8 caracteres"
                    autoComplete="new-password"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-200">
                  Repite la contrasena
                  <input
                    type={showPassword ? "text" : "password"}
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                    placeholder="Confirma tu contrasena"
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              {password && repeatPassword && password !== repeatPassword && (
                <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  Las contrasenas no coinciden. Asegurate de ingresar la misma clave.
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-200/85">
                <input
                  type="checkbox"
                  id="show-password"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-300"
                />
                <label htmlFor="show-password">Mostrar contrasena</label>
              </div>

              <label className="space-y-2 text-sm font-semibold text-slate-200">
                Selecciona tu rol
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15"
                  required
                >
                  {roles.map((roleOption) => (
                    <option
                      key={roleOption.value || "empty"}
                      value={roleOption.value}
                      className="bg-slate-800 text-white"
                    >
                      {roleOption.label}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" className="primary-button w-full">
                Crear cuenta
              </button>
            </form>

            <div className="mt-8 space-y-3 text-center text-sm text-slate-200/85">
              <p>
                Ya tienes una cuenta?{" "}
                <Link to="/login" className="font-semibold hover:text-white">
                  Inicia sesion
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-200 hover:text-white"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
