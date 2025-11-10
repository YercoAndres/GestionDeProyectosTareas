import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

function ProjectModalContent({
  project,
  task: initialTask,
  onClose,
  canViewSuggestions = false,
}) {
  const [task, setTask] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    estimated_hours: "",
    story_points: "",
    priority: "",
    estado: "en progreso",
    responsable_id: "",
  });
  const [members, setMembers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (initialTask) {
      setTask({
        ...initialTask,
        estimated_hours:
          initialTask.estimated_hours !== null &&
          initialTask.estimated_hours !== undefined
            ? String(initialTask.estimated_hours)
            : "",
        story_points:
          initialTask.story_points !== null &&
          initialTask.story_points !== undefined
            ? String(initialTask.story_points)
            : "",
      });
    }
  }, [initialTask]);

  useEffect(() => {
    const fetchMembersAndSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const requestOptions = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined;

        const response = await fetch(
          `http://localhost:5000/api/projects/${project.id}/members`,
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setMembers(
            Array.isArray(data)
              ? data.map((member) => ({
                  ...member,
                  id: Number(member.id),
                  weeklyCapacityHours:
                    member.weeklyCapacityHours !== undefined &&
                    member.weeklyCapacityHours !== null
                      ? Number(member.weeklyCapacityHours)
                      : 0,
                }))
              : []
          );
        } else {
          console.error("Error al obtener los miembros:", response.statusText);
        }

        if (token && canViewSuggestions) {
          const suggestionsResponse = await fetch(
            `http://localhost:5000/api/projects/${project.id}/assignment-suggestions`,
            requestOptions
          );
          if (suggestionsResponse.ok) {
            const suggestionsData = await suggestionsResponse.json();
            setSuggestions(
              Array.isArray(suggestionsData)
                ? suggestionsData.map((item) => ({
                    ...item,
                    userId: Number(item.userId),
                    availableHours:
                      item.availableHours !== undefined &&
                      item.availableHours !== null
                        ? Number(item.availableHours)
                        : 0,
                    activeTasks:
                      item.activeTasks !== undefined &&
                      item.activeTasks !== null
                        ? Number(item.activeTasks)
                        : 0,
                  }))
                : []
            );
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
      }
    };

    fetchMembersAndSuggestions();
  }, [project.id, canViewSuggestions]);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const taskWithProjectId = {
      ...task,
      projectId: project.id,
      estimated_hours:
        task.estimated_hours !== ""
          ? Number.parseFloat(task.estimated_hours)
          : null,
      story_points:
        task.story_points !== ""
          ? Number.parseInt(task.story_points, 10)
          : null,
    };

    if (Number.isNaN(taskWithProjectId.estimated_hours)) {
      taskWithProjectId.estimated_hours = null;
    }
    if (Number.isNaN(taskWithProjectId.story_points)) {
      taskWithProjectId.story_points = null;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks${
          initialTask ? `/${initialTask.id}` : `/${project.id}/tasks`
        }`,
        {
          method: initialTask ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskWithProjectId),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al ${initialTask ? "editar" : "agregar"} la tarea`
        );
      }

      toast.success(
        `Tarea ${initialTask ? "editada" : "agregada"} exitosamente`
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error al ${initialTask ? "editar" : "agregar"} la tarea`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-900/70 px-4 py-6 backdrop-blur">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4">
          {initialTask ? "Editar Tarea" : "Agregar Tarea"}
        </h3>
        <form onSubmit={handleSaveTask}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Título de la Tarea
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={task.name}
              onChange={handleTaskChange}
              placeholder="Ingresa el nombre de la tarea"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Ingresa la descripción de la tarea"
              value={task.description}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="estimated_hours"
              >
                Horas estimadas
              </label>
              <input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                min="0"
                step="0.25"
                value={task.estimated_hours}
                onChange={handleTaskChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ej: 2.5"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="story_points"
              >
                Story points
              </label>
              <input
                type="number"
                id="story_points"
                name="story_points"
                min="0"
                step="1"
                value={task.story_points}
                onChange={handleTaskChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Ej: 3"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="start_date"
            >
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={task.start_date}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="end_date"
            >
              Fecha de Fin
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={task.end_date}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="priority"
            >
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecciona una prioridad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="estado"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={task.estado}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="en progreso">En Progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="responsable_id"
            >
              Responsable
            </label>
            <select
              id="responsable_id"
              name="responsable_id"
              value={task.responsable_id}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecciona un responsable</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.weeklyCapacityHours ?? 0} h disp.
                </option>
              ))}
            </select>
            {suggestions.length > 0 && (
              <div className="mt-2 rounded border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <p className="font-semibold uppercase tracking-wide text-slate-500">
                  Recomendados
                </p>
                <ul className="mt-1 space-y-1">
                  {suggestions.slice(0, 3).map((item) => (
                    <li key={item.userId} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>
                        {Math.max(
                          Number(item.availableHours || 0),
                          0
                        ).toFixed(1)}{" "}
                        h libres
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {initialTask ? "Guardar Cambios" : "Agregar Tarea"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectModal(props) {
  if (typeof document === "undefined") {
    return null;
  }
  return createPortal(<ProjectModalContent {...props} />, document.body);
}
