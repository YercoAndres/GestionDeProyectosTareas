import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const INFO_TILES = [
  {
    label: "Rol asignado",
    key: "role",
    helper:
      "Tu rol determina el nivel de acceso y las acciones que puedes realizar dentro de ProjectTask.",
  },
  {
    label: "Correo de contacto",
    key: "email",
    helper:
      "Asegurate de mantener un correo activo para recibir notificaciones y recordatorios clave.",
  },
];

export default function Settings() {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setFetchError("No se encontro el usuario en la sesion actual.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("No fue posible cargar los datos del perfil.");
        }
        const userData = await response.json();
        setUser(userData);
        setFetchError(null);
      } catch (error) {
        console.error("Error:", error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const quickMeta = useMemo(
    () => [
      {
        label: "Nombre completo",
        value: user.name || "Sin asignar",
      },
      {
        label: "Email",
        value: user.email || "Sin asignar",
      },
      {
        label: "Rol",
        value:
          user.role === "manager"
            ? "Project manager"
            : user.role === "user"
            ? "Miembro de equipo"
            : user.role || "Sin asignar",
      },
    ],
    [user]
  );

  return (
    <Sidebar>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.25),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
          <header className="glass-panel flex flex-col gap-6 rounded-3xl p-8 text-slate-100 shadow-2xl md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                Configuracion
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Ajusta tu perfil y preferencias
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-200/80 md:text-base">
                Mantener tu informacion al dia ayuda a que tu equipo sepa
                exactamente como contactarte y que responsabilidades tienes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="primary-button w-full md:w-auto"
              disabled={loading || !!fetchError}
            >
              Editar perfil
            </button>
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="glass-panel rounded-3xl p-8">
              <h2 className="text-xl font-semibold text-white">
                Datos personales
              </h2>
              <p className="mt-2 text-sm text-slate-200/75">
                Revisa y actualiza la informacion asociada a tu cuenta.
              </p>
              {loading ? (
                <div className="mt-6 space-y-3">
                  <div className="h-12 rounded-2xl bg-white/10" />
                  <div className="h-12 rounded-2xl bg-white/10" />
                  <div className="h-12 rounded-2xl bg-white/10" />
                </div>
              ) : fetchError ? (
                <div className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-4 py-4 text-sm text-rose-100">
                  {fetchError}
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {quickMeta.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200/85"
                    >
                      <p className="text-xs uppercase tracking-wide text-slate-300/70">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="glass-panel flex flex-col gap-6 rounded-3xl p-8">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Seguridad y acceso
                </h2>
                <p className="mt-2 text-sm text-slate-200/75">
                  Refuerza tus credenciales y define quienes pueden invitarte a
                  nuevos proyectos.
                </p>
              </div>
              <div className="space-y-4 text-sm text-slate-200/85">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-5 py-4 text-left font-semibold text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-400/20"
                >
                  Cambiar contrasena
                </button>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-wide text-slate-300/70">
                    Accesos relevantes
                  </p>
                  <p className="mt-2 text-slate-200/85">
                    Asegurate de cerrar sesion en dispositivos compartidos y
                    mantener tu correo verificado para recuperar acceso de forma
                    segura.
                  </p>
                </div>
              </div>
            </article>
          </section>

          <section className="mt-10 glass-panel rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-white">
              Detalles adicionales
            </h2>
            <p className="mt-2 text-sm text-slate-200/75">
              Estos campos ayudan a los administradores a conocerte mejor.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {INFO_TILES.map((info) => (
                <div
                  key={info.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200/85"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-300/70">
                    {info.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {user[info.key] || "Sin asignar"}
                  </p>
                  <p className="mt-2 text-xs text-slate-300/75">
                    {info.helper}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setIsEditing(false)}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          userId={user.id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </Sidebar>
  );
}
