import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProyectCard";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../components/ConfirmDialog";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const STATUS_LABELS = ["En Progreso", "En Pausa", "Completado"];
const STATUS_CREATE = ["En Progreso", "En Pausa"];

const AVAILABILITY_LABELS = {
  available: "Disponible",
  limited: "Disponibilidad limitada",
  unavailable: "No disponible",
};

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

const normalizeDateForInput = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return "";
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    members: [],
    status: "En Progreso",
    id: null,
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  const collaboratorRoleId = useMemo(() => {
    const collaborator = roles.find((role) => role.role_key === "collaborator");
    if (collaborator) {
      return collaborator.id;
    }
    return roles.length > 0 ? roles[0].id : null;
  }, [roles]);

  const buildProjectState = useCallback(
    (projectId, projectInput, previousProject = {}) => {
      const previousAssignments = Array.isArray(
        previousProject.memberAssignments
      )
        ? previousProject.memberAssignments
        : [];

      const memberList = Array.isArray(projectInput.members)
        ? projectInput.members
        : [];

      const normalizedAssignments = memberList
        .map((member) => {
          if (member && typeof member === "object") {
            const userId = Number(
              member.userId ?? member.id ?? member.user_id ?? member.memberId
            );
            if (Number.isNaN(userId) || userId <= 0) {
              return null;
            }
            const roleIdRaw =
              member.roleId ?? member.role_id ?? member.roleId ?? null;
            const resolvedRoleId =
              roleIdRaw !== null && roleIdRaw !== undefined
                ? Number(roleIdRaw)
                : collaboratorRoleId;
            const userInfo = users.find((user) => user.id === userId);
            const previousInfo = previousAssignments.find(
              (assignment) => assignment.userId === userId
            );
            const roleInfo = roles.find(
              (role) => role.id === resolvedRoleId
            ) || previousInfo;

            return {
              userId,
              roleId: resolvedRoleId || null,
              roleKey: roleInfo?.roleKey ?? roleInfo?.role_key ?? null,
              roleName: roleInfo?.roleName ?? roleInfo?.name ?? null,
              name: userInfo?.name ?? previousInfo?.name ?? null,
            };
          }
          const userId = Number(member);
          if (Number.isNaN(userId) || userId <= 0) {
            return null;
          }
          const userInfo = users.find((user) => user.id === userId);
          const previousInfo = previousAssignments.find(
            (assignment) => assignment.userId === userId
          );
          const resolvedRoleId =
            previousInfo?.roleId ?? collaboratorRoleId ?? null;
          const roleInfo = roles.find((role) => role.id === resolvedRoleId);

          return {
            userId,
            roleId: resolvedRoleId,
            roleKey: roleInfo?.role_key ?? previousInfo?.roleKey ?? null,
            roleName: roleInfo?.name ?? previousInfo?.roleName ?? null,
            name: userInfo?.name ?? previousInfo?.name ?? null,
          };
        })
        .filter(Boolean);

      const memberNames = normalizedAssignments.map(
        (assignment) => assignment.name || `Usuario ${assignment.userId}`
      );

      const memberIds = normalizedAssignments.map(
        (assignment) => assignment.userId
      );

      return {
        ...previousProject,
        id: projectId,
        name: projectInput.name,
        description: projectInput.description,
        startDate: projectInput.startDate,
        endDate: projectInput.endDate,
        status: projectInput.status,
        members: memberNames,
        memberIds,
        memberAssignments: normalizedAssignments,
        start_date: projectInput.startDate,
        end_date: projectInput.endDate,
      };
    },
    [users, roles, collaboratorRoleId]
  );

  const toggleModal = () => {
    setShowModal((prev) => !prev);
    if (!showModal) {
      setNewProject({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        members: [],
        status: "En Progreso",
        id: null,
      });
      setError(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role);
      setCurrentUserId(decodedToken.id);
    }

    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        const normalizedProjects = Array.isArray(data)
          ? data.map((project) => ({
              ...project,
              memberAssignments: Array.isArray(project.memberAssignments)
                ? project.memberAssignments.map((assignment) => ({
                    ...assignment,
                    userId:
                      assignment.userId !== undefined
                        ? Number(assignment.userId)
                        : assignment.id !== undefined
                        ? Number(assignment.id)
                        : null,
                    roleId:
                      assignment.roleId !== undefined &&
                      assignment.roleId !== null
                        ? Number(assignment.roleId)
                        : null,
                  }))
                : [],
            }))
          : [];
        setProjects(normalizedProjects);
      })
      .catch((fetchError) =>
        console.error("Error fetching projects:", fetchError)
      );

    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => {
        const normalizedUsers = Array.isArray(data)
          ? data.map((user) => ({
              ...user,
              id: Number(user.id),
              weekly_capacity_hours:
                user.weekly_capacity_hours !== undefined &&
                user.weekly_capacity_hours !== null
                  ? Number(user.weekly_capacity_hours)
                  : 0,
            }))
          : [];
        setUsers(normalizedUsers);
      })
      .catch((fetchError) =>
        console.error("Error fetching users:", fetchError)
      );

    if (token) {
      fetch("http://localhost:5000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching roles");
          }
          return response.json();
        })
        .then((data) => {
          setRoles(Array.isArray(data) ? data : []);
        })
        .catch((fetchError) => {
          console.error("Error fetching roles:", fetchError);
        });
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddProject = (event) => {
    event.preventDefault();

    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const memberPayload = Array.isArray(newProject.members)
      ? newProject.members
          .map((member) => {
            if (member && typeof member === "object") {
              const userId = Number(member.userId ?? member.id);
              if (Number.isNaN(userId) || userId <= 0) {
                return null;
              }
              const roleIdValue =
                member.roleId !== undefined && member.roleId !== null
                  ? Number(member.roleId)
                  : collaboratorRoleId || null;
              return { userId, roleId: roleIdValue };
            }
            const userId = Number(member);
            if (Number.isNaN(userId) || userId <= 0) {
              return null;
            }
            return { userId, roleId: collaboratorRoleId || null };
          })
          .filter(Boolean)
      : [];

    const sanitizedStatus =
      !newProject.id && newProject.status === "Completado"
        ? "En Progreso"
        : newProject.status || "En Progreso";

    const projectToAdd = {
      ...newProject,
      members: memberPayload,
      status: sanitizedStatus,
    };

    toast.success(
      newProject.id
        ? "Proyecto actualizado correctamente"
        : "Proyecto creado correctamente"
    );

    if (newProject.id) {
      fetch(`http://localhost:5000/api/projects/${newProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectToAdd),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al editar el proyecto");
          }
          return response.json();
        })
        .then(() => {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === newProject.id
                ? buildProjectState(newProject.id, projectToAdd, project)
                : project
            )
          );
          setNewProject({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            members: [],
            status: "En Progreso",
            id: null,
          });
          setSearchTerm("");
          setError("");
          setShowModal(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Error al editar el proyecto. Intentalo de nuevo.");
        });
    } else {
      fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectToAdd),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el proyecto");
          }
          return response.json();
        })
        .then((data) => {
          setProjects((prevProjects) => [
            ...prevProjects,
            buildProjectState(data.projectId, projectToAdd),
          ]);
          setNewProject({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            members: [],
            status: "En Progreso",
            id: null,
          });
          setSearchTerm("");
          setError("");
          setShowModal(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Error al crear el proyecto. Intentalo de nuevo.");
        });
    }
  };

  const handleMemberChange = (memberId) => {
    const userId = Number(memberId);
    if (Number.isNaN(userId) || userId <= 0) {
      return;
    }
    setNewProject((prev) => {
      const exists = prev.members.find(
        (member) =>
          (typeof member === "object" ? member.userId : member) === userId
      );
      if (exists) {
        const updatedMembers = prev.members.filter((member) => {
          if (typeof member === "object") {
            return member.userId !== userId;
          }
          return Number(member) !== userId;
        });
        return { ...prev, members: updatedMembers };
      }

      const newAssignment = {
        userId,
        roleId: collaboratorRoleId || null,
      };
      return { ...prev, members: [...prev.members, newAssignment] };
    });
  };

  const handleMemberRoleChange = (memberId, roleId) => {
    const userId = Number(memberId);
    const parsedRoleId =
      roleId === "" || roleId === null || roleId === undefined
        ? null
        : Number(roleId);
    setNewProject((prev) => ({
      ...prev,
      members: prev.members.map((member) => {
        if (
          (typeof member === "object" ? member.userId : member) === userId
        ) {
          return {
            userId,
            roleId:
              parsedRoleId !== null && !Number.isNaN(parsedRoleId)
                ? parsedRoleId
                : collaboratorRoleId || null,
          };
        }
        if (typeof member === "object") {
          return member;
        }
        return { userId: Number(member), roleId: collaboratorRoleId || null };
      }),
    }));
  };

  const handleEditProject = async (project) => {
    const baseProject = {
      id: project.id,
      name: project.name || "",
      description: project.description || "",
      startDate: normalizeDateForInput(project.startDate || project.start_date),
      endDate: normalizeDateForInput(project.endDate || project.end_date),
      members: Array.isArray(project.memberIds) ? project.memberIds : [],
      status: normalizeStatusLabel(project.status) || "En Progreso",
    };

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
        if (Array.isArray(data)) {
          baseProject.members = data
            .map((member) => ({
              userId: Number(member.id),
              roleId:
                member.roleId !== undefined && member.roleId !== null
                  ? Number(member.roleId)
                  : collaboratorRoleId || null,
            }))
            .filter(
              (member) =>
                !Number.isNaN(member.userId) && member.userId > 0
            );
          baseProject.memberAssignments = data.map((member) => ({
            userId: Number(member.id),
            roleId:
              member.roleId !== undefined && member.roleId !== null
                ? Number(member.roleId)
                : collaboratorRoleId || null,
            roleName: member.roleName || null,
            roleKey: member.roleKey || null,
            name: member.name || null,
          }));
        }
      } else {
        console.error(
          "Error al obtener los miembros del proyecto:",
          response.statusText
        );
      }
    } catch (fetchError) {
      console.error("Error al obtener los miembros del proyecto:", fetchError);
    }

    setNewProject(baseProject);
    setSearchTerm("");
    setError(null);
    setShowModal(true);
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setConfirmDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      fetch(`http://localhost:5000/api/projects/${projectToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar el proyecto");
          }
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.id !== projectToDelete)
          );
          setProjectToDelete(null);
          setConfirmDialogVisible(false);
        })
        .catch((err) => {
          console.error("Error al eliminar el proyecto:", err);
          setError("Error al eliminar el proyecto. Intentalo de nuevo.");
        });
      toast.success("Proyecto eliminado correctamente");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusSummary = useMemo(
    () => buildStatusSummary(projects),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (!projectFilter.trim()) {
      return projects;
    }
    return projects.filter((project) =>
      project.name
        ?.toLowerCase()
        .includes(projectFilter.trim().toLowerCase())
    );
  }, [projects, projectFilter]);

  return (
    <Sidebar>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.25),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.25),transparent_45%)]" />
        <div className="relative w-full px-4 py-10 lg:px-8 lg:py-14">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
                Gestion de proyectos
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Organiza iniciativas y manten al equipo alineado
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200/80 md:text-base">
                Crea, edita y supervisa proyectos con informacion clara y
                espacios colaborativos que mantienen a todos en sincronia.
              </p>
            </div>
            <button
              onClick={toggleModal}
              disabled={userRole === "user"}
              className={`primary-button inline-flex items-center gap-2 ${
                userRole === "user"
                  ? "cursor-not-allowed opacity-60 saturate-50"
                  : ""
              }`}
            >
              <FaPlus className="text-base" />
              Nuevo proyecto
            </button>
          </header>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Total proyectos
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {projects.length}
              </p>
              <p className="mt-2 text-sm text-slate-200/80">
                Manten un backlog saludable y prioriza segun impacto y esfuerzo.
              </p>
            </div>
            {STATUS_LABELS.map((label) => (
              <div key={label} className="glass-panel rounded-3xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {label}
                </p>
                <p className="mt-3 text-3xl font-bold text-white">
                  {statusSummary[label] || 0}
                </p>
                <p className="mt-2 text-sm text-slate-200/80">
                  {label === "Completado"
                    ? "Celebra logros y documenta aprendizajes."
                    : label === "En Pausa"
                    ? "Revisa bloqueos e identifica dependencias criticas."
                    : "Supervisa entregables clave y avances del sprint."}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-12 space-y-6">
            <div className="glass-panel flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Buscar proyectos
                </p>
                <p className="text-xs text-slate-200/75">
                  Filtra por nombre para encontrar iniciativas especificas.
                </p>
              </div>
              <input
                type="search"
                placeholder="Buscar por nombre..."
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:bg-white/15 md:w-80"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
              {filteredProjects.length === 0 ? (
                <div className="glass-panel rounded-3xl p-10 text-center text-sm text-slate-200/75">
                  No hay proyectos que coincidan con la busqueda actual. Crea un
                  proyecto nuevo o ajusta el filtro.
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    userRole={userRole}
                    currentUserId={currentUserId}
                    onEdit={() => handleEditProject(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      {showModal && (
        <Modal
          onClose={toggleModal}
          title={newProject.id ? "Editar proyecto" : "Nuevo proyecto"}
          buttonText={newProject.id ? "Guardar cambios" : "Crear proyecto"}
          onSubmit={handleAddProject}
        >
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-800">
                Nombre
                <input
                  type="text"
                  placeholder="Nombre del proyecto"
                  value={newProject.name}
                  onChange={(event) =>
                    setNewProject({ ...newProject, name: event.target.value })
                  }
                  required
                  className="w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-800">
                Estado
                <select
                  name="status"
                  id="status"
                  className="w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                  value={newProject.status}
                  onChange={(event) =>
                    setNewProject({ ...newProject, status: event.target.value })
                  }
                >
                  <option value="">Selecciona una opcion</option>
                  {(newProject.id ? STATUS_LABELS : STATUS_CREATE).map(
                    (label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label className="block space-y-2 text-sm font-semibold text-slate-800">
              Descripcion
              <textarea
                placeholder="Describe el objetivo y alcance"
                value={newProject.description}
                onChange={(event) =>
                  setNewProject({
                    ...newProject,
                    description: event.target.value,
                  })
                }
                className="min-h-[120px] w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-slate-800">
                Fecha de inicio
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      startDate: event.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                />
              </label>
              <label className="space-y-2 text-sm font-semibold text-slate-800">
                Fecha de fin
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      endDate: event.target.value,
                    })
                  }
                  required
                  className="w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
                />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-800">
                Seleccionar miembros
              </label>
              <input
                type="text"
                placeholder="Buscar miembro..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-slate-300/50 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60"
              />
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl border border-slate-300/50 bg-white p-3 text-sm">
                {filteredUsers.length === 0 ? (
                  <p className="text-slate-500">
                    No se encontraron colaboradores con ese nombre.
                  </p>
                ) : (
                  filteredUsers.map((user) => {
                    const selectedMember = newProject.members.find((member) =>
                      typeof member === "object"
                        ? member.userId === user.id
                        : Number(member) === user.id
                    );
                    const computedRoleId =
                      selectedMember && selectedMember.roleId !== undefined
                        ? selectedMember.roleId
                        : collaboratorRoleId || "";
                    const formattedCapacity =
                      user.weekly_capacity_hours !== undefined &&
                      user.weekly_capacity_hours !== null
                        ? Number(user.weekly_capacity_hours).toFixed(1).replace(
                            /\.0$/,
                            ""
                          )
                        : "0";

                    return (
                      <div
                        key={user.id}
                        className="rounded-lg border border-slate-200/60 px-3 py-3 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-slate-900"
                      >
                        <label
                          htmlFor={`user-${user.id}`}
                          className="flex items-center gap-3 text-slate-700"
                        >
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={Boolean(selectedMember)}
                            onChange={() => handleMemberChange(user.id)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-slate-500">
                              Capacidad semanal: {formattedCapacity} h · Estado:{" "}
                              {AVAILABILITY_LABELS[user.availability_status] ||
                                "Sin estado"}
                            </p>
                            {user.availability_notes && (
                              <p className="text-xs text-slate-400">
                                {user.availability_notes}
                              </p>
                            )}
                          </div>
                        </label>
                        {Boolean(selectedMember) && roles.length > 0 && (
                          <div className="mt-3 flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <span className="font-semibold uppercase tracking-wide text-slate-500">
                              Rol dentro del proyecto
                            </span>
                            <select
                              value={computedRoleId ?? ""}
                              onChange={(event) =>
                                handleMemberRoleChange(
                                  user.id,
                                  event.target.value
                                )
                              }
                              onClick={(event) => event.stopPropagation()}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 sm:w-48"
                            >
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-500">
                {error}
              </p>
            )}
          </form>
        </Modal>
      )}

      {confirmDialogVisible && (
        <ConfirmDialog
          message="Estas seguro de que deseas eliminar este proyecto?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDialogVisible(false)}
        />
      )}
    </Sidebar>
  );
};

export default Projects;
