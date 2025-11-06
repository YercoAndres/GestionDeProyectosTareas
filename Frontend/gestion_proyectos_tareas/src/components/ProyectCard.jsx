import React, { useEffect, useState } from "react";
import ProjectModal from "./ProjectModal";
import ConfirmDialog from "./ConfirmDialog";
import { Eye, CirclePlus, Pencil, Trash, SquareX } from "lucide-react";
import { toast } from "react-toastify";
import ButtonExportProject from "./ButtonExportProject";

const PRIORITY_STYLES = {
  Baja: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  Media: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  Alta: "border-rose-300/40 bg-rose-400/10 text-rose-100",
};

const statusStyle = (status) => {
  switch (status) {
    case "Completado":
      return "bg-emerald-400/10 text-emerald-100 border border-emerald-300/40";
    case "En Pausa":
      return "bg-amber-400/10 text-amber-100 border border-amber-300/40";
    case "En Progreso":
      return "bg-cyan-400/10 text-cyan-100 border border-cyan-300/40";
    default:
      return "bg-slate-400/10 text-slate-200 border border-slate-300/30";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const capitalizeFirstLetter = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const ProjectCard = ({ project, userRole, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/${project.id}/tasks`
        );
        if (response.ok) {
          const data = await response.json();
          setTasks(data || []);
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${project.id}/members`
        );
        if (response.ok) {
          const data = await response.json();
          setMembers(data || []);
        }
      } catch (error) {
        console.error("Error al obtener los miembros:", error);
      }
    };

    if (showInfo) {
      fetchTasks();
      fetchMembers();
    }
  }, [project.id, showInfo]);

  const toggleInfo = () => {
    setShowInfo((prev) => !prev);
  };

  const priorityColor = (priority) =>
    PRIORITY_STYLES[priority] ||
    "border-slate-300/30 bg-slate-400/10 text-slate-200";

  const getResponsableName = (responsableId) => {
    const member = members.find((item) => item.id === responsableId);
    return member ? member.name : "Responsable no asignado";
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((taskItem) => taskItem.id !== taskId));
        toast.success("Tarea eliminada exitosamente");
      } else {
        const errorData = await response.json();
        console.error(
          "Error al eliminar la tarea:",
          errorData.message || response.statusText
        );
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsConfirmDialogOpen(false);
  };

  const handleOpenConfirmDialog = (taskId) => {
    setTaskToDelete(taskId);
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 p-8 text-slate-100 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
            Proyecto
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {project.name}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-200/80">
            {project.description ||
              "Aun no se ha definido una descripcion para este proyecto."}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <ButtonExportProject project={project} />
          <button
            onClick={toggleInfo}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-400/20"
          >
            <Eye size={18} />
            {showInfo ? "Ocultar detalles" : "Ver detalles"}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/30"
          >
            <CirclePlus size={18} />
            Nueva tarea
          </button>
          <button
            onClick={onEdit}
            disabled={userRole === "user"}
            className={`inline-flex items-center gap-2 rounded-full border border-indigo-300/40 px-4 py-2 text-sm font-semibold transition ${
              userRole === "user"
                ? "cursor-not-allowed bg-indigo-500/20 text-indigo-200/60 opacity-60"
                : "bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30"
            }`}
          >
            <Pencil size={18} />
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={userRole === "user"}
            className={`inline-flex items-center gap-2 rounded-full border border-rose-300/40 px-4 py-2 text-sm font-semibold transition ${
              userRole === "user"
                ? "cursor-not-allowed bg-rose-500/20 text-rose-200/60 opacity-60"
                : "bg-rose-500/20 text-rose-100 hover:bg-rose-500/30"
            }`}
          >
            <Trash size={18} />
            Eliminar
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mt-8 space-y-8 text-sm text-slate-200/85">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Inicio
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatDate(project.start_date || project.startDate)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Fin estimado
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatDate(project.end_date || project.endDate)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-300/80">
              Estado actual
            </p>
            <span
              className={`mt-3 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${statusStyle(
                project.status
              )}`}
            >
              {project.status || "Sin estado"}
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-300/80">
              Miembros asignados
            </p>
            {Array.isArray(members) && members.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-100"
                  >
                    {member.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-200/70">
                No hay miembros asignados actualmente.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Tareas vinculadas
              </p>
              <span className="text-xs font-semibold text-slate-200/70">
                {tasks.length} tareas
              </span>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`relative overflow-hidden rounded-2xl border px-4 py-5 transition hover:-translate-y-1 hover:shadow-2xl ${priorityColor(
                      task.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/70">
                          Prioridad
                        </p>
                        <p className="text-lg font-semibold">
                          {task.priority || "Sin prioridad"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenConfirmDialog(task.id)}
                          className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
                        >
                          <SquareX size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-white/85">
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          Tarea
                        </p>
                        <p className="text-sm capitalize text-white">
                          {task.name}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          Descripcion
                        </p>
                        <p className="text-sm text-white/80">
                          {task.description || "Sin descripcion"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="font-semibold uppercase tracking-wide">
                            Inicio
                          </p>
                          <p className="text-sm">
                            {formatDate(task.start_date)}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold uppercase tracking-wide">
                            Fin
                          </p>
                          <p className="text-sm">
                            {formatDate(task.end_date)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          Responsable
                        </p>
                        <p className="text-sm">
                          {getResponsableName(task.responsable_id)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-wide">
                          Estado
                        </p>
                        <p className="text-sm">
                          {task.estado
                            ? capitalizeFirstLetter(task.estado)
                            : "Estado no disponible"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-xs text-slate-100/75">
                  No hay tareas asignadas en este proyecto todavia.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          project={project}
          task={selectedTask}
          onClose={handleCloseModal}
        />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="Estas seguro de que deseas eliminar esta tarea?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ProjectCard;
