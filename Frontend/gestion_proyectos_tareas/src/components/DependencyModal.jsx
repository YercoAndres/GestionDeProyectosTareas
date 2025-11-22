import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const DEPENDENCY_TYPES = [
  { value: "FS", label: "Fin → Inicio (FS)" },
  { value: "FF", label: "Fin → Fin (FF)" },
  { value: "SS", label: "Inicio → Inicio (SS)" },
  { value: "SF", label: "Inicio → Fin (SF)" },
];

export default function DependencyModal({
  projectId,
  tasks,
  existingDependencies,
  onClose,
  onSaved,
}) {
  const [formState, setFormState] = useState({
    taskId: "",
    dependsOnTaskId: "",
    dependencyType: "FS",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  const invalidPairs = useMemo(() => {
    const pairs = new Set();
    (existingDependencies || []).forEach((dependency) => {
      pairs.add(`${dependency.task_id}-${dependency.depends_on_task_id}`);
    });
    return pairs;
  }, [existingDependencies]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.taskId || !formState.dependsOnTaskId) {
      toast.error("Selecciona ambas tareas.");
      return;
    }
    if (formState.taskId === formState.dependsOnTaskId) {
      toast.error("Una tarea no puede depender de sí misma.");
      return;
    }
    const pairKey = `${formState.taskId}-${formState.dependsOnTaskId}`;
    if (invalidPairs.has(pairKey)) {
      toast.error("La dependencia ya existe.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No se encontró token de autenticación.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/dependencies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId: Number(formState.taskId),
            dependsOnTaskId: Number(formState.dependsOnTaskId),
            dependencyType: formState.dependencyType,
            note: formState.note,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No fue posible crear la dependencia.");
      }

      toast.success("Dependencia creada correctamente.");
      if (onSaved) {
        await onSaved();
      }
      onClose();
    } catch (error) {
      console.error("Error al crear dependencia:", error);
      toast.error(
        error.message || "Error al crear la dependencia. Intenta nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">
          Nueva dependencia
        </h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tarea dependiente
            </label>
            <select
              name="taskId"
              value={formState.taskId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
            >
              <option value="">Selecciona la tarea</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Depende de
            </label>
            <select
              name="dependsOnTaskId"
              value={formState.dependsOnTaskId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
            >
              <option value="">Selecciona la tarea previa</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tipo de dependencia
            </label>
            <select
              name="dependencyType"
              value={formState.dependencyType}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
            >
              {DEPENDENCY_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              FS: La tarea comienza cuando la previa termina. Otros tipos
              cubren combinaciones de inicios y finales.
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nota (opcional)
            </label>
            <textarea
              name="note"
              rows={2}
              value={formState.note}
              onChange={handleChange}
              placeholder="Información adicional relevante para el equipo"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Crear dependencia"}
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

DependencyModal.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  existingDependencies: PropTypes.arrayOf(
    PropTypes.shape({
      task_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      depends_on_task_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    })
  ),
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
