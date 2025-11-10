import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const formatTaskName = (name) =>
  name && name.length > 32 ? `${name.slice(0, 29)}...` : name || "Tarea";

export default function TimeEntryModal({
  task,
  projectId,
  currentUserId,
  onClose,
  onLogged,
}) {
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numericHours = Number.parseFloat(hours);
    if (!numericHours || numericHours <= 0) {
      toast.error("Ingresa una cantidad de horas mayor a cero.");
      return;
    }

    const minutes = Math.max(1, Math.round(numericHours * 60));
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No se encontró un token de autenticación.");
      return;
    }

    const now = new Date();
    const startedAt = new Date(now.getTime() - minutes * 60000);

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/time-entries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId: task.id,
            projectId,
            userId: currentUserId,
            startedAt: startedAt.toISOString(),
            endedAt: now.toISOString(),
            durationMinutes: minutes,
            note,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no válida del servidor");
      }

      toast.success("Tiempo registrado correctamente");
      setHours("");
      setNote("");
      setIsSubmitting(false);
      if (onLogged) {
        await onLogged();
      } else if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error al registrar tiempo:", error);
      toast.error("No se pudo registrar el tiempo. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-900">
          Registrar tiempo
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Añade el tiempo trabajado para <strong>{formatTaskName(task.name)}</strong>.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="hours"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Horas invertidas
            </label>
            <input
              type="number"
              id="hours"
              min="0"
              step="0.25"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              placeholder="Ej: 1.5"
              required
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-slate-400">
              Puedes registrar fracciones de hora (ej. 0.5 = 30 minutos).
            </p>
          </div>
          <div>
            <label
              htmlFor="note"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Nota (opcional)
            </label>
            <textarea
              id="note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              placeholder="Resumen de lo trabajado..."
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Registrar"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TimeEntryModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
  }).isRequired,
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onClose: PropTypes.func,
  onLogged: PropTypes.func,
};
