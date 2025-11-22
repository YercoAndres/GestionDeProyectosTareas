import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AVAILABILITY_LABELS = {
  available: "Disponible",
  limited: "Disponibilidad limitada",
  unavailable: "No disponible",
};

const INFO_TILES = [
  {
    label: "Rol asignado",
    key: "role",
    helper:
      "Tu rol determina el nivel de acceso y las acciones que puedes realizar dentro de ProjectTask.",
    transform: (value) =>
      value === "manager"
        ? "Project manager"
        : value === "user"
          ? "Miembro de equipo"
          : value || "Sin asignar",
  },
  {
    label: "Correo de contacto",
    key: "email",
    helper:
      "Asegurate de mantener un correo activo para recibir notificaciones y recordatorios clave.",
  },
  {
    label: "Capacidad semanal",
    key: "weekly_capacity_hours",
    helper:
      "Define cuántas horas puedes dedicar semanalmente para mejorar la planificación del equipo.",
    transform: (value) =>
      value !== undefined && value !== null
        ? `${Number(value).toFixed(1).replace(/\.0$/, "")} h`
        : "Sin asignar",
  },
  {
    label: "Disponibilidad actual",
    key: "availability_status",
    helper:
      "Comunica al equipo si estás disponible, con disponibilidad limitada o no disponible.",
    transform: (value) => AVAILABILITY_LABELS[value] || "Sin asignar",
  },
  {
    label: "Notas de disponibilidad",
    key: "availability_notes",
    helper:
      "Comparte información relevante como vacaciones, recordatorios o horarios especiales.",
    transform: (value) => value || "Sin notas registradas",
  },
];

export default function Settings() {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
    weekly_capacity_hours: 40,
    availability_status: "available",
    availability_notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [capacityForm, setCapacityForm] = useState({
    weeklyCapacityHours: "40",
    availabilityStatus: "available",
    availabilityNotes: "",
  });
  const [capacitySaving, setCapacitySaving] = useState(false);
  const [capacityFeedback, setCapacityFeedback] = useState(null);

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
        setCapacityForm({
          weeklyCapacityHours:
            userData.weekly_capacity_hours !== undefined &&
            userData.weekly_capacity_hours !== null
              ? String(userData.weekly_capacity_hours)
              : "40",
          availabilityStatus: userData.availability_status || "available",
          availabilityNotes: userData.availability_notes || "",
        });
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

  useEffect(() => {
    setCapacityForm({
      weeklyCapacityHours:
        user.weekly_capacity_hours !== undefined &&
        user.weekly_capacity_hours !== null
          ? String(user.weekly_capacity_hours)
          : "40",
      availabilityStatus: user.availability_status || "available",
      availabilityNotes: user.availability_notes || "",
    });
  }, [
    user.weekly_capacity_hours,
    user.availability_status,
    user.availability_notes,
  ]);

  const handleCapacityInputChange = (event) => {
    const { name, value } = event.target;
    setCapacityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (capacityFeedback) {
      setCapacityFeedback(null);
    }
  };

  const handleCapacitySubmit = async (event) => {
    event.preventDefault();
    if (!user.id) {
      setCapacityFeedback({
        type: "error",
        message: "No se encontró el usuario actual.",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCapacityFeedback({
        type: "error",
        message: "No se encontró token de autenticación.",
      });
      return;
    }

    const numericCapacity = Number(capacityForm.weeklyCapacityHours);
    if (Number.isNaN(numericCapacity) || numericCapacity < 0) {
      setCapacityFeedback({
        type: "error",
        message: "Ingresa una capacidad semanal válida.",
      });
      return;
    }

    try {
      setCapacitySaving(true);
      setCapacityFeedback(null);
      const response = await fetch(
        `${API_BASE}/api/users/${user.id}/capacity`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            weeklyCapacityHours: numericCapacity,
            availabilityStatus: capacityForm.availabilityStatus,
            availabilityNotes: capacityForm.availabilityNotes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("No fue posible actualizar la capacidad.");
      }

      setCapacityFeedback({
        type: "success",
        message: "Capacidad actualizada correctamente.",
      });
      setUser((prev) => ({
        ...prev,
        weekly_capacity_hours: numericCapacity,
        availability_status: capacityForm.availabilityStatus,
        availability_notes: capacityForm.availabilityNotes,
      }));

      setTimeout(() => {
        setCapacityFeedback(null);
      }, 4000);
    } catch (error) {
      console.error("Error actualizando capacidad:", error);
      setCapacityFeedback({
        type: "error",
        message: error.message || "Error al actualizar la capacidad.",
      });
    } finally {
      setCapacitySaving(false);
    }
  };

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
      {
        label: "Capacidad semanal",
        value:
          user.weekly_capacity_hours !== undefined &&
          user.weekly_capacity_hours !== null
            ? `${Number(user.weekly_capacity_hours)
                .toFixed(1)
                .replace(/\.0$/, "")} h`
            : "Sin asignar",
      },
      {
        label: "Disponibilidad",
        value: AVAILABILITY_LABELS[user.availability_status] || "Sin asignar",
      },
    ],
    [user],
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
                  <div className="skeleton-block h-12 w-full" />
                  <div className="skeleton-block h-12 w-full" />
                  <div className="skeleton-block h-12 w-full" />
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
                      className="card-strong rounded-2xl px-5 py-4 text-sm"
                    >
                      <p
                        className="text-xs uppercase tracking-wide"
                        style={{ color: "var(--muted-text)" }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="mt-1 text-lg font-semibold"
                        style={{ color: "var(--heading-text)" }}
                      >
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
                <div className="card-muted rounded-2xl px-5 py-4">
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "var(--muted-text)" }}
                  >
                    Accesos relevantes
                  </p>
                  <p className="mt-2" style={{ color: "var(--body-text)" }}>
                    Asegurate de cerrar sesion en dispositivos compartidos y
                    mantener tu correo verificado para recuperar acceso de forma
                    segura.
                  </p>
                </div>
                <div className="card-muted rounded-2xl px-5 py-4">
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "var(--muted-text)" }}
                  >
                    Capacidad y disponibilidad
                  </p>
                  <p
                    className="mt-2 text-xs"
                    style={{ color: "var(--body-text)" }}
                  >
                    Actualiza tus horas disponibles y estado para que las
                    sugerencias de asignación reflejen tu carga real.
                  </p>
                  <form
                    onSubmit={handleCapacitySubmit}
                    className="mt-4 space-y-3 text-xs text-slate-200/85"
                  >
                    <div>
                      <label className="block font-semibold text-slate-200/80">
                        Horas disponibles por semana
                      </label>
                      <input
                        type="number"
                        name="weeklyCapacityHours"
                        min="0"
                        step="0.5"
                        value={capacityForm.weeklyCapacityHours}
                        onChange={handleCapacityInputChange}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-200/80">
                        Estado de disponibilidad
                      </label>
                      <select
                        name="availabilityStatus"
                        value={capacityForm.availabilityStatus}
                        onChange={handleCapacityInputChange}
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
                      >
                        {Object.entries(AVAILABILITY_LABELS).map(
                          ([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-200/80">
                        Notas (opcional)
                      </label>
                      <textarea
                        name="availabilityNotes"
                        rows={3}
                        value={capacityForm.availabilityNotes}
                        onChange={handleCapacityInputChange}
                        placeholder="Ej. Disponibilidad reducida durante examenes."
                        className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={capacitySaving}
                    >
                      {capacitySaving
                        ? "Guardando..."
                        : "Guardar disponibilidad"}
                    </button>
                    {capacityFeedback && (
                      <p
                        className={`text-xs ${
                          capacityFeedback.type === "error"
                            ? "text-rose-200"
                            : "text-emerald-200"
                        }`}
                      >
                        {capacityFeedback.message}
                      </p>
                    )}
                  </form>
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
                    {(info.transform
                      ? info.transform(user[info.key], user)
                      : user[info.key]) || "Sin asignar"}
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
