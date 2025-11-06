import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";

const highlights = [
  "Sincroniza tareas y notificaciones en tiempo real",
  "Visualiza prioridades con tableros y cronogramas",
  "Colabora con tu equipo desde cualquier dispositivo",
];

function Login() {
  const { set: setLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud");
      }
      const data = await response.json();

      if (data.user && data.user.id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        toast.success("Inicio de sesion exitoso");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.35),transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-16 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="glass-panel hidden h-full flex-col justify-between rounded-3xl p-10 text-slate-100 shadow-2xl lg:flex">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200">
                Bienvenido de vuelta
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Enfocate en avanzar, nosotros ordenamos tu proyecto.
              </h1>
              <p className="mt-4 max-w-md text-sm text-slate-200/85">
                Accede a tus paneles, revisa el progreso del equipo y mantente
                alineado con las prioridades diarias desde un mismo lugar.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-slate-200/90">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 p-4"
                >
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/90 text-[10px] font-bold text-emerald-950">
                    OK
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4 text-sm text-slate-200/90">
              <div>
                <p className="text-xs uppercase tracking-wide text-cyan-200/90">
                  Consejo del dia
                </p>
                <p>
                  Programa recordatorios automaticos para no perder hitos
                  criticos del sprint.
                </p>
              </div>
              <img
                src="../assets/icon.png"
                alt="ProjectTask icon"
                className="hidden h-14 w-14 rotate-12 rounded-2xl border border-white/15 bg-white/80 p-3 shadow-2xl lg:block"
              />
            </div>
          </div>

          <div className="glass-panel w-full rounded-3xl p-10 shadow-2xl">
            <div className="mb-10 space-y-3 text-center">
              <h2 className="text-3xl font-bold text-white">
                Inicia sesion en ProjectTask
              </h2>
              <p className="text-sm text-slate-200/80">
                Mantente al tanto del estado de tus tareas y proyectos prioritarios.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Correo electronico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:bg-white/15"
                  placeholder="tu@empresa.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Contrasena
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:bg-white/15"
                  placeholder="Ingresa tu contrasena"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="primary-button w-full">
                Iniciar sesion
              </button>
            </form>

            <div className="mt-8 space-y-3 text-center text-sm text-slate-200/85">
              <Link to="#" className="transition hover:text-white">
                Olvidaste tu contrasena?
              </Link>
              <p>
                No tienes una cuenta?{" "}
                <Link to="/register" className="font-semibold hover:text-white">
                  Registrate aqui
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-cyan-200 hover:text-white"
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

export default Login;
