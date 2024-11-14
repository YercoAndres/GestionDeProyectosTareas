import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete }) => { // Acepta onEdit y onDelete como props
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { // Cambia isNaN por isNaN(date.getTime())
      return 'Fecha inválida'; // Manejo de error
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p>{project.description}</p>
      <p>Fechas: {formatDate(project.start_date)} - {formatDate(project.end_date)}</p>
      <p>Miembros: {project.members.length > 0 ? project.members.length : 'No hay miembros'}</p>      <div className="mt-4">
        <button onClick={onEdit} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
          Editar
        </button>
        <button onClick={onDelete} className="bg-red-500 text-white px-2 py-1 rounded">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;