import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "planned", label: "Planificado" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completado" },
  { value: "delayed", label: "Retrasado" },
];

const formatForInput = (value) => {
  if (!value) return "";
  return value.slice(0, 10);
};

export default function MilestoneModal({
  projectId,
  milestone,
  onClose,
  onSaved,
}) {
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    start_date: "",
    due_date: "",
    status: "planned",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (milestone) {
      setFormState({
        name: milestone.name || "",
        description: milestone.description || "",
        start_date: formatForInput(milestone.start_date),
        due_date: formatForInput(milestone.due_date),
        status: milestone.status || "planned",
      });
    } else {
      setFormState({
        name: "",
        description: "",
        start_date: "",
        due_date: "",
        status: "planned",
      });
    }
  }, [milestone]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      toast.error("El nombre del hito es obligatorio.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No se encontró token de autenticación.");
      return;
    }

    setSaving(true);
    try {
      const endpoint = milestone
        ? `http://localhost:5000/api/projects/${projectId}/milestones/${milestone.id}`
        : `http://localhost:5000/api/projects/${projectId}/milestones`;
      const method = milestone ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          description: formState.description,
          startDate: formState.start_date || null,
          dueDate: formState.due_date || null,
          status: formState.status,
        }),
      });

      if (!response.ok) {
        throw new Error("No fue posible guardar el hito.");
      }

      toast.success(
        milestone ? "Hito actualizado correctamente." : "Hito creado."
      );
      if (onSaved) {
        await onSaved();
      }
      onClose();
    } catch (error) {
      console.error("Error al guardar hito:", error);
      toast.error(error.message || "Error al guardar el hito.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">
          {milestone ? "Editar hito" : "Nuevo hito"}
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Descripción
            </label>
            <textarea
              name="description"
              rows={3}
              value={formState.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              placeholder="Contexto, objetivos o entregables asociados"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fecha de inicio
              </label>
              <input
                type="date"
                name="start_date"
                value={formState.start_date}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fecha objetivo
              </label>
              <input
                type="date"
                name="due_date"
                value={formState.due_date}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Estado
            </label>
            <select
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving
                ? milestone
                  ? "Guardando..."
                  : "Creando..."
                : milestone
                ? "Guardar cambios"
                : "Crear hito"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

MilestoneModal.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  milestone: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    description: PropTypes.string,
    start_date: PropTypes.string,
    due_date: PropTypes.string,
    status: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
