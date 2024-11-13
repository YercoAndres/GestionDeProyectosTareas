// src/components/ProjectCard.jsx
import React from 'react';

const ProjectCard = ({ project }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-4">
      <h3 className="text-xl font-bold">{project.name}</h3>
      <p className="text-gray-600">{project.description || 'Sin descripción'}</p>
      <p className="text-gray-500">Fecha de Inicio: {formatDate(project.start_date)}</p>
      <p className="text-gray-500">Fecha de Fin: {formatDate(project.end_date)}</p>
      <div className="mt-2">
        <h4 className="font-semibold">Miembros:</h4>
        {project.members && project.members.length > 0 ? (
          <ul className="list-disc pl-5">
            {project.members.map((member, index) => (
              <li key={index} className="text-gray-600">{member}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay miembros asignados</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;