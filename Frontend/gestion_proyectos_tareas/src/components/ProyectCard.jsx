import React, { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import ProjectViewModal from './ProjectViewModal'; // Asegúrate de importar ProjectViewModal
import jwt_decode from 'jwt-decode'; // Necesario para decodificar el JWT
import { Eye, CirclePlus, Pencil, Trash } from 'lucide-react';

const ProjectCard = ({ project, userRole, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenViewModal = () => {
    // Fetch tasks for the project
    fetch(`http://localhost:5000/tasks/${project.id}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setIsViewModalOpen(true);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p>{project.description}</p>
     
     
      <div className="mt-4 flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
        <button 
          onClick={handleOpenViewModal} 
          className={`bg-cyan-800 hover:bg-cyan-950 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Eye size={24} className="inline-block mr-3" />
          Ver Proyecto
        </button>
        <button 
          onClick={handleOpenModal} 
          className={`bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <CirclePlus size={24} className="inline-block mr-3" />
          Agregar tarea
        </button>
        <button 
          onClick={onEdit} 
          className={`bg-sky-700 hover:bg-sky-800 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Pencil size={24} className="inline-block mr-3" />
          Editar
        </button>
        <button 
          onClick={onDelete} 
          className={`bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Trash size={24} className="inline-block mr-3" />
          Eliminar
        </button>
      </div>

      {isModalOpen && (
        <ProjectModal project={project} onClose={handleCloseModal} />
      )}

      {isViewModalOpen && (
        <ProjectViewModal project={project} tasks={tasks} onClose={handleCloseViewModal} />
      )}
    </div>
  );
};

export default ProjectCard;