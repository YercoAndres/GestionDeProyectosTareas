import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProyectCard";
import { FaPlus } from "react-icons/fa";
import ConfirmDialog from "../components/ConfirmDialog";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const STATUS_LABELS = ["En Progreso", "En Pausa", "Completado"];

const buildStatusSummary = (projects) =>
  projects.reduce(
    (summary, project) => {
      const status = project.status || "Sin estado";
      if (!summary[status]) {
        summary[status] = 0;
      }
      summary[status] += 1;
      return summary;
    },
    { "Sin estado": 0 }
  );

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [userRole, setUserRole] = useState("");
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
  const [error, setError] = useState(null);

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
    }

    fetch("http://localhost:5000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch((fetchError) =>
        console.error("Error fetching projects:", fetchError)
      );

    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((fetchError) =>
        console.error("Error fetching users:", fetchError)
      );
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
    const projectToAdd = {
      ...newProject,
      members: newProject.members,
      status: newProject.status || "En Progreso",
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
                ? { ...projectToAdd, id: newProject.id }
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
            { ...projectToAdd, id: data.projectId },
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
    setNewProject((prev) => {
      const members = prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId];
      return { ...prev, members };
    });
  };

  const handleEditProject = (project) => {
    setNewProject(project);
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
        <div className="relative mx-auto max-w-6xl px-4 py-10 lg:px-8 lg:py-14">
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
                  {STATUS_LABELS.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
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
                  filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      htmlFor={`user-${user.id}`}
                      className="flex items-center gap-3 rounded-lg border border-slate-200/60 px-3 py-2 transition hover:border-emerald-300 hover:bg-emerald-50/50"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={newProject.members.includes(user.id)}
                        onChange={() => handleMemberChange(user.id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>{user.name}</span>
                    </label>
                  ))
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
