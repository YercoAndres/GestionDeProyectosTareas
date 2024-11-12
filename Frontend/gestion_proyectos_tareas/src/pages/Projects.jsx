// src/pages/Projects.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ConfirmDialog from '../components/ConfirmDialog';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => setError('Error fetching projects'));
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    })
      .then(response => response.json())
      .then(data => {
        setProjects([...projects, data]);
        setNewProject({ name: '', description: '' });
      })
      .catch(() => setError('Error adding project'));
  };

  const handleEditProject = (project) => setEditingProject(project);

  const handleUpdateProject = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/projects/${editingProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProject),
    })
      .then(response => response.json())
      .then(data => {
        setProjects(projects.map(project => (project.id === data.id ? data : project)));
        setEditingProject(null);
      })
      .catch(() => setError('Error updating project'));
  };

  const handleDeleteProject = () => {
    fetch(`http://localhost:5000/projects/${projectToDelete}`, { method: 'DELETE' })
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectToDelete));
        setShowConfirmDialog(false);
        setProjectToDelete(null);
      })
      .catch(() => setError('Error deleting project'));
  };

  const confirmDeleteProject = (id) => {
    setProjectToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleAddTask = (projectId) => {
    fetch(`http://localhost:5000/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    })
      .then(response => response.json())
      .then(data => {
        setProjects(projects.map(project =>
          project.id === projectId ? { ...project, tasks: [...project.tasks, data] } : project
        ));
        setNewTask('');
      })
      .catch(() => setError('Error adding task'));
  };

  return (
    <Sidebar>
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Proyectos</h1>
        <p>Bienvenido a la sección de proyectos. Aquí puedes ver y gestionar todos tus proyectos.</p>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Proyecto</h2>
          <form onSubmit={handleAddProject}>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre del Proyecto</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Introduce el nombre del proyecto"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Introduce una descripción del proyecto"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Crear Proyecto
            </button>
          </form>
        </div>




        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Proyectos</h2>
          <ul className="space-y-4">
            {projects.length > 0 ? (
              projects.map(project => (
                <li key={project.id} className="p-4 bg-white rounded shadow">
                  {editingProject && editingProject.id === project.id ? (
                    <form onSubmit={handleUpdateProject}>
                      <input
                        type="text"
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                      />
                      <textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                      ></textarea>
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 ml-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <p>{project.description}</p>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="px-4 py-2 mt-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => confirmDeleteProject(project.id)}
                        className="px-4 py-2 mt-2 ml-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Tareas</h4>
                    <ul className="list-disc list-inside">
                      {project.tasks && project.tasks.length > 0 ? (
                        project.tasks.map((task, index) => (
                          <li key={index}>{task.task}</li>
                        ))
                      ) : (
                        <li>No hay tareas</li>
                      )}
                    </ul>
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="w-full p-2 mt-2 border border-gray-300 rounded"
                      placeholder="Nueva tarea"
                    />
                    <button
                      onClick={() => handleAddTask(project.id)}
                      className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Agregar Tarea
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li>No hay proyectos disponibles</li>
            )}
          </ul>
        </div>
        

        
        {showConfirmDialog && (
          <ConfirmDialog
            isOpen={showConfirmDialog}
            onConfirm={handleDeleteProject}
            onCancel={() => setShowConfirmDialog(false)}
            message="¿Estás seguro de que deseas eliminar este proyecto?"
          />
        )}
      </div>
    </Sidebar>
  );
};

export default Projects;
