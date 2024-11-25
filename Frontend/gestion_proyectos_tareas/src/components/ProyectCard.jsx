import React, { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import jwt_decode from 'jwt-decode'; // Necesario para decodificar el JWT
import { Eye, CirclePlus, Pencil, Trash} from 'lucide-react';

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
    <div className="border p-4 rounded shadow-md ">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p>{project.description}</p>
      <p>Fechas: {formatDate(project.start_date)} - {formatDate(project.end_date)}</p>
     
      <div className="mt-4 flex  space-x-2">
        <button 
          onClick={handleOpenModal} 
          className={`bg-cyan-800 hover:bg-cyan-950 text-white px-2 py-1 rounded mr-2 ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Eye size={24} className="inline-block mr-3" />
          Ver Proyecto
        </button>
        <button 
          onClick={handleOpenModal} 
          className={`bg-green-400 hover:bg-green-500 text-white px-2 py-1 rounded mr-2 ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <CirclePlus size={24} className="inline-block mr-3" />
          Agregar tarea
        </button>
        <button 
          onClick={onEdit} 
          className={`bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded mr-2 ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    </div>
  );
};

export default ProjectCard;
