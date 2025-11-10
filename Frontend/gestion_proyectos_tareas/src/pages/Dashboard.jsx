import React, { useEffect, useMemo, useState } from "react";
import jwt_decode from "jwt-decode";
import Sidebar from "../components/Sidebar";
import ProjectTimeline from "../components/ProjectTimeline";

const STATUS_LABELS = ["En Progreso", "En Pausa", "Completado"];

const normalizeStatusLabel = (status) => {
  if (!status) {
    return "Sin estado";
  }

  const lower = status.toLowerCase();
  if (lower.includes("pausa")) {
    return "En Pausa";
  }
  if (lower.includes("complet")) {
    return "Completado";
  }
  if (lower.includes("progreso")) {
    return "En Progreso";
  }

  return status;
};

const buildStatusSummary = (projects) =>
  projects.reduce(
    (summary, project) => {
      const status = normalizeStatusLabel(project.status);
      if (!summary[status]) {
        summary[status] = 0;
      }
      summary[status] += 1;
      return summary;
    },
    { "Sin estado": 0 }
  );

const buildTaskSummary = (tasks) =>
  tasks.reduce(
    (summary, task) => {
      const state = task.estado?.toLowerCase() || "pendiente";
      if (state.includes("complet")) {
        summary.completed += 1;
      } else if (state.includes("progreso")) {
        summary.inProgress += 1;
      } else {
        summary.pending += 1;
      }
      return summary;
    },
    { pending: 0, inProgress: 0, completed: 0 }
  );

const formatHours = (value) => {
  const numeric = Number(value) || 0;
  if (Math.abs(numeric) < 0.05) {
    return "0 h";
  }
  const precision = Math.abs(numeric) >= 10 ? 0 : 1;
  return `${numeric.toFixed(precision)} h`;
};

const MILESTONE_STATUS_BADGES = {
  planned: { label: "Planificado", classes: "bg-slate-400/15 text-slate-100" },
  in_progress: { label: "En progreso", classes: "bg-cyan-400/15 text-cyan-100" },
  completed: {
    label: "Completado",
    classes: "bg-emerald-400/15 text-emerald-100",
  },
  delayed: { label: "Retrasado", classes: "bg-rose-400/15 text-rose-100" },
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projectInfo, setProjectInfo] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [overviewMetrics, setOverviewMetrics] = useState(null);
  const [projectAnalytics, setProjectAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [projectMilestones, setProjectMilestones] = useState([]);

  const formatMilestoneDate = (value) => {
    if (!value) {
      return "Sin fecha";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Sin fecha";
    }
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let decodedRole = "";

    const authHeaders = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    if (token) {
      try {
        const decoded = jwt_decode(token);
        decodedRole = decoded.role;
      } catch (error) {
        console.error("No se pudo decodificar el token JWT", error);
        decodedRole = "";
      }
    } else {
      decodedRole = "";
    }

    const fetchDashboardData = async () => {
      try {
        const [projectsResponse, usersResponse, tasksResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/projects", {
              headers: authHeaders,
            }),
            fetch("http://localhost:5000/api/users", {
              headers: authHeaders,
            }),
            fetch("http://localhost:5000/api/tasks", {
              headers: authHeaders,
            }),
          ]);

        const [projectsData, usersData, tasksData] = await Promise.all([
          projectsResponse.json(),
          usersResponse.json(),
          tasksResponse.json(),
        ]);

        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);

        if (decodedRole === "manager" && token) {
          const overviewResponse = await fetch(
            "http://localhost:5000/api/analytics/overview",
            { headers: authHeaders }
          );
          if (overviewResponse.ok) {
            const overviewData = await overviewResponse.json();
            setOverviewMetrics(overviewData);
          } else {
            setOverviewMetrics(null);
          }
        } else {
          setOverviewMetrics(null);
        }
      } catch (error) {
        console.error("Error al cargar los datos", error);
        setOverviewMetrics(null);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setProjectAnalytics(null);
      setAnalyticsError(null);
      setAnalyticsLoading(false);
      setProjectMilestones([]);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setAnalyticsError(
        "No se encontró un token de autenticación para consultar métricas."
      );
      setProjectAnalytics(null);
      return;
    }

    const controller = new AbortController();
    const loadAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        setAnalyticsError(null);
        const response = await fetch(
          `http://localhost:5000/api/analytics/projects/${selectedProject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error(`Respuesta inválida (${response.status})`);
        }
        const data = await response.json();
        setProjectAnalytics(data);

        if (token) {
          const milestonesResponse = await fetch(
            `http://localhost:5000/api/projects/${selectedProject}/milestones`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          );
          if (milestonesResponse.ok) {
            const milestonesData = await milestonesResponse.json();
            setProjectMilestones(
              Array.isArray(milestonesData) ? milestonesData : []
            );
          } else {
            setProjectMilestones([]);
          }
        } else {
          setProjectMilestones([]);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        console.error("Error al obtener analíticas del proyecto:", error);
        setAnalyticsError("No se pudieron cargar las métricas del proyecto.");
        setProjectAnalytics(null);
        setProjectMilestones([]);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    loadAnalytics();

    return () => {
      controller.abort();
    };
  }, [selectedProject]);

  const statusSummary = useMemo(() => {
    if (overviewMetrics?.projectsByStatus) {
      return Object.entries(overviewMetrics.projectsByStatus).reduce(
        (acc, [status, total]) => {
          const label = normalizeStatusLabel(status);
          acc[label] = total;
          return acc;
        },
        { "Sin estado": overviewMetrics.projectsByStatus["Sin estado"] || 0 }
      );
    }
    return buildStatusSummary(projects);
  }, [overviewMetrics, projects]);
  const taskSummary = useMemo(() => buildTaskSummary(tasks), [tasks]);

  const totalEstimatedHours = useMemo(() => {
    if (overviewMetrics?.totalEstimatedHours !== undefined) {
      return Number(overviewMetrics.totalEstimatedHours) || 0;
    }
    return tasks.reduce(
      (acc, task) => acc + (Number(task.estimated_hours) || 0),
      0
    );
  }, [overviewMetrics, tasks]);

  const totalLoggedHours = useMemo(() => {
    if (overviewMetrics?.totalLoggedHours !== undefined) {
      return Number(overviewMetrics.totalLoggedHours) || 0;
    }
    return 0;
  }, [overviewMetrics]);

  const projectTotals = useMemo(() => {
    if (!projectAnalytics?.totals) {
      return {
        estimatedHours: 0,
        loggedHours: 0,
        storyPoints: 0,
        tasks: 0,
      };
    }
    return {
      estimatedHours: Number(projectAnalytics.totals.estimatedHours) || 0,
      loggedHours: Number(projectAnalytics.totals.loggedHours) || 0,
      storyPoints: Number(projectAnalytics.totals.storyPoints) || 0,
      tasks: Number(projectAnalytics.totals.tasks) || 0,
    };
  }, [projectAnalytics]);

  const hoursGap = useMemo(
    () => totalEstimatedHours - totalLoggedHours,
    [totalEstimatedHours, totalLoggedHours]
  );

  const projectTimelines = useMemo(() => {
    const parseProjectDate = (project, key) =>
      project[key] ||
      project[`${key}_date`] ||
      project[`${key}Date`] ||
      project[`${key}_at`];

    const items = projects
      .map((project) => {
        const startRaw = parseProjectDate(project, "start");
        const endRaw = parseProjectDate(project, "end");

        if (!startRaw && !endRaw) return null;

        const start = startRaw ? new Date(startRaw) : null;
        const end = endRaw ? new Date(endRaw) : null;

        const startValid = start && !Number.isNaN(start.getTime());
        const endValid = end && !Number.isNaN(end.getTime());

        if (!startValid && !endValid) {
          return null;
        }

        return {
          id: project.id,
          name: project.name,
          status: project.status,
          start: startValid ? start : null,
          end: endValid ? end : null,
        };
      })
      .filter(Boolean);

    if (items.length === 0) {
      return { items: [], bounds: null };
    }

    const validStarts = items
      .map((item) => item.start?.getTime())
      .filter((time) => Number.isFinite(time));
    const validEnds = items
      .map((item) => item.end?.getTime())
      .filter((time) => Number.isFinite(time));

    const minStart = validStarts.length
      ? new Date(Math.min(...validStarts))
      : null;
    const maxEnd = validEnds.length ? new Date(Math.max(...validEnds)) : null;

    const spanDays =
      minStart && maxEnd
        ? Math.max(
            1,
            Math.ceil((maxEnd.getTime() - minStart.getTime()) / 86400000)
          )
        : 1;

    return {
      items,
      bounds:
        minStart && maxEnd
          ? {
              start: minStart,
              end: maxEnd,
              spanDays,
            }
          : null,
    };
  }, [projects]);

  const observabilityMetrics = useMemo(() => {
    const today = new Date();
    const floorToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const upcomingThreshold = new Date(floorToday);
    upcomingThreshold.setDate(floorToday.getDate() + 7);

    let startingSoon = 0;
    let endingSoon = 0;
    let overdue = 0;

    projects.forEach((project) => {
      const startRaw = project.start_date || project.startDate;
      const endRaw = project.end_date || project.endDate;

      const start = startRaw ? new Date(startRaw) : null;
      const end = endRaw ? new Date(endRaw) : null;

      if (start && !Number.isNaN(start) && start >= floorToday && start <= upcomingThreshold) {
        startingSoon += 1;
      }
      if (end && !Number.isNaN(end) && end >= floorToday && end <= upcomingThreshold) {
        endingSoon += 1;
      }
      if (end && !Number.isNaN(end) && end < floorToday && project.status !== "Completado") {
        overdue += 1;
      }
    });

    return { startingSoon, endingSoon, overdue };
  }, [projects]);

  const handleSelectChange = (event) => {
    const projectId = event.target.value;
    setSelectedProject(projectId);
    if (!projectId) {
      setProjectInfo(null);
      setFilteredTasks([]);
      return;
    }

    const project = projects.find((item) => String(item.id) === projectId);
    setProjectInfo(project || null);

    const tasksData = Array.isArray(tasks) ? tasks : [];
    const filtered = tasksData.filter(
      (task) => String(task.project_id) === projectId
    );
    setFilteredTasks(filtered);
  };

  const topProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3),
    [projects]
  );

  return (
    <Sidebar>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.25),transparent_55%)]" />
        <div className="relative w-full px-4 py-10 lg:px-8 lg:py-14">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">
                Panel general
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Bienvenido al centro de control
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/80 md:text-base">
                Visualiza el rendimiento de tus equipos, identifica cuellos de
                botella y haz seguimiento a cada deliverable sin perderte de
                nada.
              </p>
            </div>
            <div className="glass-panel rounded-2xl px-5 py-4 text-sm text-slate-200/85">
              <p className="uppercase tracking-wide text-xs text-cyan-200/80">
                Estado actual
              </p>
              <p>
                {projects.length} proyectos, {tasks.length} tareas activas y{" "}
                {users.length} miembros colaborando.
              </p>
            </div>
          </header>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Proyectos activos
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {projects.length}
              </p>
              <div className="mt-4 space-y-1 text-sm text-slate-200/85">
                {STATUS_LABELS.map((label) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span>{statusSummary[label] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Tareas
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {tasks.length}
              </p>
              <div className="mt-4 grid gap-3">
                <div className="flex justify-between rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                  <span>Completadas</span>
                  <span>{taskSummary.completed}</span>
                </div>
                <div className="flex justify-between rounded-2xl bg-indigo-400/10 px-4 py-3 text-sm text-indigo-100">
                  <span>En progreso</span>
                  <span>{taskSummary.inProgress}</span>
                </div>
                <div className="flex justify-between rounded-2xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                  <span>Pendientes</span>
                  <span>{taskSummary.pending}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
                Tiempo registrado
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {formatHours(totalLoggedHours)}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-200/80">
                <div className="flex justify-between">
                  <span>Horas estimadas</span>
                  <span>{formatHours(totalEstimatedHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horas registradas</span>
                  <span>{formatHours(totalLoggedHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saldo estimado</span>
                  <span
                    className={
                      hoursGap >= 0 ? "text-emerald-200" : "text-rose-200"
                    }
                  >
                    {hoursGap > 0
                      ? `+${formatHours(hoursGap)}`
                      : formatHours(hoursGap)}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">
                Proximos hitos
              </p>
              <div className="mt-3 space-y-3">
                {topProjects.length === 0 && (
                  <p className="text-sm text-slate-200/75">
                    Aun no se registran proyectos con fechas proximas.
                  </p>
                )}
                {topProjects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-300/80">
                      Inicio:{" "}
                      {project.start_date
                        ? new Date(project.start_date).toLocaleDateString(
                            "es-ES"
                          )
                        : "Sin fecha"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-300/80">
                      Fin:{" "}
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString(
                            "es-ES"
                          )
                        : "Sin fecha"}
                    </p>
                  </div>
                ))}
              </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass-panel rounded-3xl p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Carta Gantt simplificada
              </h2>
              <p className="text-sm text-slate-200/80">
                Visualiza la duracion relativa de cada proyecto y detecta
                solapamientos o cuellos de botella.
              </p>
            </div>
            <p className="text-xs uppercase tracking-wide text-slate-300/70">
              {projectTimelines.bounds
                ? `${projectTimelines.items.length} proyectos - ${projectTimelines.bounds.spanDays} dias`
                : "Datos insuficientes"}
            </p>
          </div>
          <div className="mt-6">
            <ProjectTimeline
              items={projectTimelines.items}
              bounds={projectTimelines.bounds}
            />
          </div>
        </div>

        <div className="glass-panel flex flex-col gap-6 rounded-3xl p-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Observabilidad rapida
            </h2>
            <p className="text-sm text-slate-200/80">
              Indicadores que te permiten actuar antes de que un proyecto se
              desvie.
            </p>
          </div>
          <ul className="space-y-4 text-sm">
            <li className="accent-card accent-card-success">
              <p className="accent-card-label">
                Inician en 7 dias
              </p>
              <p className="accent-card-metric mt-1 text-3xl font-semibold">
                {observabilityMetrics.startingSoon}
              </p>
              <p className="accent-card-note mt-2">
                Confirma que el equipo y los recursos esten listos.
              </p>
            </li>
            <li className="accent-card accent-card-warning">
              <p className="accent-card-label">
                Finalizan en 7 dias
              </p>
              <p className="accent-card-metric mt-1 text-3xl font-semibold">
                {observabilityMetrics.endingSoon}
              </p>
              <p className="accent-card-note mt-2">
                Prioriza revisiones y entregables finales.
              </p>
            </li>
            <li className="accent-card accent-card-danger">
              <p className="accent-card-label">
                Vencidos pendientes
              </p>
              <p className="accent-card-metric mt-1 text-3xl font-semibold">
                {observabilityMetrics.overdue}
              </p>
              <p className="accent-card-note mt-2">
                Revisa bloqueos y redefine fechas criticas.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-3xl p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Estado por proyecto
                  </h2>
                  <p className="text-sm text-slate-200/80">
                    Selecciona un proyecto para ver tareas, fechas y responsables.
                  </p>
                </div>
                <select
                  value={selectedProject}
                  onChange={handleSelectChange}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:bg-white/15 md:w-80"
                >
                  <option value="">Selecciona un proyecto</option>
                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                      className="bg-slate-900 text-white"
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {projectInfo ? (
                <>
                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                      <p className="text-xs uppercase tracking-wide text-cyan-200">
                        Fecha de inicio
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {projectInfo.start_date
                          ? new Date(projectInfo.start_date).toLocaleDateString(
                              "es-ES"
                            )
                          : "Sin fecha"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                      <p className="text-xs uppercase tracking-wide text-emerald-200">
                        Fecha de fin
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {projectInfo.end_date
                          ? new Date(projectInfo.end_date).toLocaleDateString(
                              "es-ES"
                            )
                          : "Sin fecha"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                      <p className="text-xs uppercase tracking-wide text-indigo-200">
                        Estado
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {projectInfo.status || "Sin estado"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Métricas clave
                    </h3>
                    {analyticsLoading ? (
                      <p className="mt-3 text-sm text-slate-200/70">
                        Cargando métricas del proyecto...
                      </p>
                    ) : analyticsError ? (
                      <p className="mt-3 text-sm text-rose-200/80">
                        {analyticsError}
                      </p>
                    ) : projectAnalytics ? (
                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                          <p className="text-xs uppercase tracking-wide text-cyan-200/90">
                            Horas estimadas
                          </p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {formatHours(projectTotals.estimatedHours)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                          <p className="text-xs uppercase tracking-wide text-emerald-200/90">
                            Horas registradas
                          </p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {formatHours(projectTotals.loggedHours)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                          <p className="text-xs uppercase tracking-wide text-indigo-200/90">
                            Story points totales
                          </p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {projectTotals.storyPoints}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200/85">
                          <p className="text-xs uppercase tracking-wide text-amber-200/90">
                            Registros de tiempo
                          </p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {projectAnalytics?.totals?.timeEntryCount || 0}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-200/70">
                        Selecciona un proyecto para ver sus métricas.
                      </p>
                    )}
                  </div>

                  {projectAnalytics?.tasksDueSoon &&
                    projectAnalytics.tasksDueSoon.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                          Vencimientos próximos (7 días)
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-200/85">
                          {projectAnalytics.tasksDueSoon.map((task) => (
                            <li
                              key={task.id}
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                            >
                              <div>
                                <p className="font-semibold text-white">
                                  {task.name}
                                </p>
                                <p className="text-xs uppercase tracking-wide text-slate-300/80">
                                  {task.status || "Sin estado"}
                                </p>
                              </div>
                              <span className="text-xs font-semibold text-amber-200">
                                {task.endDate
                                  ? new Date(task.endDate).toLocaleDateString(
                                      "es-ES"
                                    )
                                  : "Sin fecha"}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Hitos del proyecto
                    </h3>
                    {projectMilestones.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-200/75">
                        Aún no se han registrado hitos para este proyecto.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {projectMilestones.map((milestone) => {
                          const badge =
                            MILESTONE_STATUS_BADGES[milestone.status] ||
                            MILESTONE_STATUS_BADGES.planned;
                          return (
                            <li
                              key={milestone.id}
                              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/85"
                            >
                              <div>
                                <p className="font-semibold text-white">
                                  {milestone.name}
                                </p>
                                <p className="text-xs text-slate-300/75">
                                  {formatMilestoneDate(milestone.start_date)} →{" "}
                                  {formatMilestoneDate(milestone.due_date)}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.classes}`}
                              >
                                {badge.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Tareas vinculadas
                    </h3>
                    {filteredTasks.length === 0 ? (
                      <p className="mt-4 text-sm text-slate-200/75">
                        Este proyecto aun no cuenta con tareas asignadas.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-3">
                        {filteredTasks.map((task) => (
                          <li
                            key={task.id}
                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200/85"
                          >
                            <div>
                              <p className="font-semibold text-white">
                                {task.name}
                              </p>
                              <p className="text-xs uppercase tracking-wide text-slate-300/80">
                                {task.estado || "Sin estado"}
                              </p>
                              <p className="text-xs text-slate-300/70">
                                {task.estimated_hours
                                  ? `${task.estimated_hours} h estimadas`
                                  : "Sin estimacion"}
                              </p>
                            </div>
                            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                              {task.priority || "Sin prioridad"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-sm text-slate-200/75">
                  Selecciona un proyecto para ver su progreso y tareas asociadas.
                </div>
              )}
            </div>

            <div className="glass-panel rounded-3xl p-8">
              <h2 className="text-2xl font-semibold text-white">
                Actividad reciente
              </h2>
              <p className="mt-2 text-sm text-slate-200/80">
                Monitorea cambios importantes en los proyectos y manten a tu
                equipo informado.
              </p>
              <div className="mt-6 space-y-4 text-sm text-slate-200/85">
                {projects.length === 0 ? (
                  <p>No se registran actividades recientes.</p>
                ) : (
                  projects.slice(0, 6).map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="font-semibold text-white">
                        {project.name}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-300/80">
                        Estado: {project.status || "Sin estado"}
                      </p>
                      <p className="text-xs text-slate-300/80">
                        Actualizado el{" "}
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleString("es-ES")
                          : "Sin informacion"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Sidebar>
  );
}
