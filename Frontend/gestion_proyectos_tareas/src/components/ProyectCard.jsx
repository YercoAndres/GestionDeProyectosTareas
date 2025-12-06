import { useCallback, useEffect, useState } from "react";
import ProjectModal from "./ProjectModal";
import ConfirmDialog from "./ConfirmDialog";
import MilestoneModal from "./MilestoneModal";
import DependencyModal from "./DependencyModal";
import {
  Eye,
  CirclePlus,
  Pencil,
  Trash,
  SquareX,
  Timer,
} from "lucide-react";
import { toast } from "react-toastify";
import ButtonExportProject from "./ButtonExportProject";
import TimeEntryModal from "./TimeEntryModal";

const PRIORITY_STYLES = {
  Baja: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  Media: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  Alta: "border-rose-300/40 bg-rose-400/10 text-rose-100",
};

const AVAILABILITY_LABELS = {
  available: "Disponible",
  limited: "Disponibilidad limitada",
  unavailable: "No disponible",
};

const MILESTONE_STATUS = {
  planned: {
    label: "Planificado",
    classes: "bg-slate-400/15 text-slate-100 border border-slate-300/30",
  },
  in_progress: {
    label: "En progreso",
    classes: "bg-cyan-400/15 text-cyan-100 border border-cyan-300/30",
  },
  completed: {
    label: "Completado",
    classes: "bg-emerald-400/15 text-emerald-100 border border-emerald-300/30",
  },
  delayed: {
    label: "Retrasado",
    classes: "bg-rose-400/15 text-rose-100 border border-rose-300/30",
  },
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

const formatMinutesToHours = (minutes) => {
  if (!minutes || Number.isNaN(minutes)) {
    return "0 h";
  }
  const hours = minutes / 60;
  if (hours < 1) {
    return `${Math.round(minutes)} min`;
  }
  const precision = hours >= 10 ? 0 : 1;
  return `${hours.toFixed(precision)} h`;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

const ProjectCard = ({
  project,
  userRole,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [dependencies, setDependencies] = useState([]);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [criticalPath, setCriticalPath] = useState({
    criticalPath: [],
    totalDuration: 0,
  });
  const [timeSummary, setTimeSummary] = useState({
    totalMinutes: 0,
    entryCount: 0,
    byUser: [],
  });
  const [timeModalTask, setTimeModalTask] = useState(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const loadTasks = useCallback(async () => {
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
  }, [project.id]);

  const loadMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/projects/${project.id}/members`,
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
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
                activeAssignedHours:
                  member.activeAssignedHours !== undefined &&
                  member.activeAssignedHours !== null
                    ? Number(member.activeAssignedHours)
                    : 0,
                availableHours:
                  member.availableHours !== undefined &&
                  member.availableHours !== null
                    ? Number(member.availableHours)
                    : null,
              }))
            : []
        );
      }
    } catch (error) {
      console.error("Error al obtener los miembros:", error);
    }
  }, [project.id]);

  const loadTimeSummary = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/time-entries/project/${project.id}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTimeSummary({
          totalMinutes: data.totalMinutes || 0,
          entryCount: data.entryCount || 0,
          byUser: Array.isArray(data.byUser) ? data.byUser : [],
        });
      }
    } catch (error) {
      console.error("Error al obtener el resumen de tiempo:", error);
    }
  }, [project.id]);

  const loadMilestones = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMilestones([]);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${project.id}/milestones`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMilestones(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error al obtener los hitos:", error);
    }
  }, [project.id]);

  const loadDependencies = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDependencies([]);
      setCriticalPath({ criticalPath: [], totalDuration: 0 });
      return;
    }
    try {
      const [depsResponse, pathResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${project.id}/dependencies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(
          `http://localhost:5000/api/projects/${project.id}/critical-path`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      if (depsResponse.ok) {
        const depsData = await depsResponse.json();
        setDependencies(Array.isArray(depsData) ? depsData : []);
      }

      if (pathResponse.ok) {
        const pathData = await pathResponse.json();
        setCriticalPath(
          pathData && typeof pathData === "object"
            ? {
                criticalPath: Array.isArray(pathData.criticalPath)
                  ? pathData.criticalPath
                  : [],
                totalDuration: pathData.totalDuration || 0,
                message: pathData.message,
              }
            : { criticalPath: [], totalDuration: 0 }
        );
      }
    } catch (error) {
      console.error("Error al obtener dependencias:", error);
    }
  }, [project.id]);

  const loadSuggestions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${project.id}/assignment-suggestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(
          Array.isArray(data)
            ? data.map((item) => ({
                ...item,
                userId: Number(item.userId),
                availableHours:
                  item.availableHours !== undefined &&
                  item.availableHours !== null
                    ? Number(item.availableHours)
                    : 0,
                assignedHours:
                  item.assignedHours !== undefined &&
                  item.assignedHours !== null
                    ? Number(item.assignedHours)
                    : 0,
                activeTasks:
                  item.activeTasks !== undefined &&
                  item.activeTasks !== null
                    ? Number(item.activeTasks)
                    : 0,
              }))
            : []
        );
      }
    } catch (error) {
      console.error("Error al obtener las sugerencias:", error);
    }
  }, [project.id]);

  useEffect(() => {
    if (showInfo) {
      loadTasks();
      loadMembers();
      loadTimeSummary();
      if (userRole === "manager") {
        loadSuggestions();
      } else {
        setSuggestions([]);
      }
      loadMilestones();
      loadDependencies();
    }
  }, [
    showInfo,
    loadMembers,
    loadTasks,
    loadTimeSummary,
    loadSuggestions,
    userRole,
    loadMilestones,
    loadDependencies,
  ]);

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

  const handleOpenTimeModal = (task) => {
    setTimeModalTask(task);
    setIsTimeModalOpen(true);
  };

  const handleCloseTimeModal = () => {
    setTimeModalTask(null);
    setIsTimeModalOpen(false);
  };

  const handleOpenMilestoneModal = (milestone = null) => {
    setSelectedMilestone(milestone);
    setIsMilestoneModalOpen(true);
  };

  const handleCloseMilestoneModal = () => {
    setSelectedMilestone(null);
    setIsMilestoneModalOpen(false);
  };

  const handleMilestoneSaved = async () => {
    await loadMilestones();
  };

  const handleDeleteMilestone = async (milestoneId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No se encontró token de autenticación.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${project.id}/milestones/${milestoneId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("No fue posible eliminar el hito.");
      }
      toast.success("Hito eliminado correctamente.");
      await loadMilestones();
    } catch (error) {
      console.error("Error al eliminar hito:", error);
      toast.error(error.message || "Error al eliminar el hito.");
    }
  };

  const handleOpenDependencyModal = () => {
    setIsDependencyModalOpen(true);
  };

  const handleCloseDependencyModal = () => {
    setIsDependencyModalOpen(false);
  };

  const handleDependencySaved = async () => {
    await loadDependencies();
  };

  const handleDeleteDependency = async (dependencyId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No se encontró token de autenticación.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${project.id}/dependencies/${dependencyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("No fue posible eliminar la dependencia.");
      }
      toast.success("Dependencia eliminada.");
      await loadDependencies();
    } catch (error) {
      console.error("Error al eliminar dependencia:", error);
      toast.error(error.message || "Error al eliminar la dependencia.");
    }
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

  const handleTimeLogged = async () => {
    handleCloseTimeModal();
    await Promise.all([loadTasks(), loadTimeSummary()]);
    if (userRole === "manager") {
      await loadSuggestions();
    }
    await loadDependencies();
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
            <div className="card-muted rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Inicio
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatDate(project.start_date || project.startDate)}
              </p>
            </div>
            <div className="card-muted rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Fin estimado
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatDate(project.end_date || project.endDate)}
              </p>
            </div>
          </div>

          <div className="card-muted rounded-2xl p-5">
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

          <div className="card-muted rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wide text-slate-300/80">
              Miembros asignados
            </p>
            {Array.isArray(members) && members.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="card-strong rounded-2xl px-4 py-3 text-xs"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-semibold text-white">
                        {member.name}
                      </span>
                      {member.roleName && (
                        <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                          {member.roleName}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-300/70">
                      Capacidad:{" "}
                      {member.weeklyCapacityHours !== undefined
                        ? member.weeklyCapacityHours
                        : 0}{" "}
                      h{" "}
                      {member.availableHours !== null &&
                      member.availableHours !== undefined
                        ? `· Libres: ${Math.max(
                            member.availableHours,
                            0
                          ).toFixed(1)} h `
                        : ""}
                      · Estado:{" "}
                      {member.availabilityStatus
                        ? AVAILABILITY_LABELS?.[member.availabilityStatus] ||
                          member.availabilityStatus
                        : "Sin estado"}
                    </p>
                    {member.availabilityNotes && (
                      <p className="mt-1 text-[11px] text-slate-300/60">
                        {member.availabilityNotes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-slate-200/70">
                No hay miembros asignados actualmente.
              </p>
            )}
          </div>

          <div className="card-muted rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Hitos del proyecto
              </p>
              {userRole === "manager" && (
                <button
                  onClick={() => handleOpenMilestoneModal()}
                  className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/25"
                >
                  Nuevo hito
                </button>
              )}
            </div>
            {milestones.length === 0 ? (
              <p className="mt-3 text-xs text-slate-200/70">
                Aún no se han definido hitos para este proyecto.
              </p>
            ) : (
              <ul className="mt-4 space-y-3 text-xs text-slate-200/85">
                {milestones.map((milestone) => {
                  const statusMeta =
                    MILESTONE_STATUS[milestone.status] || MILESTONE_STATUS.planned;
                  const start = parseDate(milestone.start_date);
                  const due = parseDate(milestone.due_date);
                  return (
                    <li
                      key={milestone.id}
                      className="card-strong rounded-2xl px-4 py-3"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {milestone.name}
                          </p>
                          <p className="text-[11px] uppercase tracking-wide text-slate-300/70">
                            {start ? formatDate(start) : "Sin inicio"} →{" "}
                            {due ? formatDate(due) : "Sin objetivo"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta.classes}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>
                      {milestone.description && (
                        <p className="mt-2 text-[11px] text-slate-300/70">
                          {milestone.description}
                        </p>
                      )}
                      {userRole === "manager" && (
                        <div className="mt-3 flex gap-2 text-[11px] text-slate-200/80">
                          <button
                            onClick={() => handleOpenMilestoneModal(milestone)}
                            className="inline-flex items-center gap-1 rounded-full border border-indigo-300/40 px-3 py-1 transition hover:bg-indigo-400/20"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-300/40 px-3 py-1 transition hover:bg-rose-400/20"
                          >
                            <Trash size={14} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Tiempo registrado
              </p>
              <span className="text-xs font-semibold text-slate-200/70">
                {formatMinutesToHours(timeSummary.totalMinutes)}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-200/70">
              {timeSummary.entryCount}{" "}
              {timeSummary.entryCount === 1 ? "registro" : "registros"} en total
            </p>
            {Array.isArray(timeSummary.byUser) &&
              timeSummary.byUser.length > 0 && (
                <ul className="mt-3 space-y-2 text-xs text-slate-200/80">
                  {timeSummary.byUser.map((item) => {
                    const member = members.find(
                      (person) => person.id === item.userId
                    );
                    return (
                      <li key={item.userId} className="flex justify-between">
                        <span>{member ? member.name : `Usuario ${item.userId}`}</span>
                        <span>{formatMinutesToHours(item.totalMinutes)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
          </div>

          {userRole === "manager" && (
            <div className="card-muted rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-300/80">
                  Sugerencias de asignación
                </p>
                <span className="text-xs font-semibold text-slate-200/70">
                  Basado en capacidad disponible
                </span>
              </div>
              {suggestions.length === 0 ? (
                <p className="mt-3 text-xs text-slate-200/70">
                  No se encontraron sugerencias en este momento.
                </p>
              ) : (
                <ul className="mt-4 space-y-2 text-xs text-slate-200/85">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <li
                      key={suggestion.userId}
                      className="card-strong flex flex-col gap-2 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {suggestion.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-wide text-slate-300/70">
                          Tareas activas: {suggestion.activeTasks} ·{" "}
                          {suggestion.isMember
                            ? "Miembro del proyecto"
                            : "Aún no asignado"}
                        </p>
                      </div>
                      <div className="text-[11px] uppercase tracking-wide text-emerald-200">
                        Disponible:{" "}
                        {Math.max(
                          Number(suggestion.availableHours || 0),
                          0
                        ).toFixed(1)}{" "}
                        h
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="card-muted rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                Dependencias de tareas
              </p>
              {userRole === "manager" && (
                <button
                  onClick={handleOpenDependencyModal}
                  className="rounded-full border border-indigo-300/40 bg-indigo-400/15 px-3 py-1 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-400/25"
                >
                  Nueva dependencia
                </button>
              )}
            </div>
            {dependencies.length === 0 ? (
              <p className="mt-3 text-xs text-slate-200/70">
                No se han registrado dependencias entre tareas.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-xs text-slate-200/85">
                {dependencies.map((dependency) => (
                  <li
                    key={dependency.id}
                    className="card-strong flex flex-col gap-2 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {dependency.task_name}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-slate-300/70">
                        depende de {dependency.depends_on_name} · Tipo:{" "}
                        {dependency.dependency_type}
                      </p>
                      {dependency.note && (
                        <p className="text-[11px] text-slate-300/60">
                          {dependency.note}
                        </p>
                      )}
                    </div>
                    {userRole === "manager" && (
                      <button
                        onClick={() => handleDeleteDependency(dependency.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-300/40 px-3 py-1 text-[11px] font-semibold text-rose-100 transition hover:bg-rose-400/20"
                      >
                        <Trash size={14} />
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {criticalPath?.message ? (
              <p className="mt-3 text-[11px] text-amber-200/90">
                {criticalPath.message}
              </p>
            ) : (
              criticalPath.criticalPath &&
              criticalPath.criticalPath.length > 0 && (
                <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-[11px] text-emerald-100">
                  <p className="font-semibold uppercase tracking-wide">
                    Ruta crítica estimada ({criticalPath.totalDuration} h)
                  </p>
                  <p className="mt-2">
                    {criticalPath.criticalPath
                      .map((item) => item.name)
                      .join(" → ")}
                  </p>
                </div>
              )
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
                    className="card-muted relative overflow-hidden rounded-2xl px-4 py-5 transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-white/70">
                          Prioridad
                        </p>
                        <p
                          className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority || "Sin prioridad"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {currentUserId && (
                          <button
                            onClick={() => handleOpenTimeModal(task)}
                            className="pill-hover rounded-full p-2 transition hover:scale-105"
                          >
                            <Timer size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(task)}
                          className="pill-hover rounded-full p-2 transition hover:scale-105"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenConfirmDialog(task.id)}
                          className="pill-hover rounded-full p-2 transition hover:scale-105"
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
                            Estimado
                          </p>
                          <p className="text-sm">
                            {task.estimated_hours !== null &&
                            task.estimated_hours !== undefined
                              ? `${task.estimated_hours} h`
                              : "Sin estimacion"}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold uppercase tracking-wide">
                            Story Points
                          </p>
                          <p className="text-sm">
                            {task.story_points !== null &&
                            task.story_points !== undefined
                              ? task.story_points
                              : "N/A"}
                          </p>
                        </div>
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
                <div className="card-strong rounded-2xl p-6 text-xs">
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
          canViewSuggestions={userRole === "manager"}
        />
      )}
      {isMilestoneModalOpen && userRole === "manager" && (
        <MilestoneModal
          projectId={project.id}
          milestone={selectedMilestone}
          onClose={handleCloseMilestoneModal}
          onSaved={handleMilestoneSaved}
        />
      )}
      {isDependencyModalOpen && userRole === "manager" && (
        <DependencyModal
          projectId={project.id}
          tasks={tasks}
          existingDependencies={dependencies}
          onClose={handleCloseDependencyModal}
          onSaved={handleDependencySaved}
        />
      )}
      {isTimeModalOpen && timeModalTask && (
        <TimeEntryModal
          task={timeModalTask}
          projectId={project.id}
          currentUserId={currentUserId}
          onClose={handleCloseTimeModal}
          onLogged={handleTimeLogged}
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
