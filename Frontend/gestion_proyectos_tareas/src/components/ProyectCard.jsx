import React, { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import jwt_decode from 'jwt-decode'; // Necesario para decodificar el JWT

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(''); // Estado para almacenar el rol del usuario

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

  // Usar useEffect para evitar la actualización del estado en cada renderizado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token); // Decodifica el token
      setUserRole(decoded.role); // Establece el rol del usuario
    }
  }, []); // El efecto solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p>{project.description}</p>
      <p>Fechas: {formatDate(project.start_date)} - {formatDate(project.end_date)}</p>
      <p>Miembros: {project.members.length > 0 ? project.members.length : 'No hay miembros'}</p>
      <div className="mt-4">
        <button 
          onClick={handleOpenModal} 
          className={`bg-green-500 text-white px-2 py-1 rounded mr-2 ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          Ver Proyecto
        </button>
        <button 
          onClick={onEdit} 
          className={`bg-blue-500 text-white px-2 py-1 rounded mr-2 ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          Editar
        </button>
        <button 
          onClick={onDelete} 
          className={`bg-red-500 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          Eliminar
        </button>
      </div>

      {isModalOpen && (
        <ProjectModal project={project} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProjectCard;
