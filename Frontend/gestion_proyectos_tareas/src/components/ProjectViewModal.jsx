import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

const priorityColor = (priority) => {
  switch (priority) {
    case 'Baja': return 'bg-green-200';
    case 'Media': return 'bg-yellow-200';
    case 'Alta': return 'bg-red-200';
    default: return 'bg-gray-200';
  }
};

export default function ProjectViewModal({ project, tasks, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        <h3 className="text-2xl font-semibold mb-4">Detalles del Proyecto</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Proyecto:</label>
          <p className="text-gray-700">{project.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
          <p className="text-gray-700">{project.description}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Inicio:</label>
          <p className="text-gray-700">{formatDate(project.start_date)}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Fin:</label>
          <p className="text-gray-700">{formatDate(project.end_date)}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Prioridad:</label>
          <p className="text-gray-700">{project.priority}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-2xl font-bold mb-2">Tareas asignadas al proyecto:</label>
          <div className="grid grid-cols-2 gap-2">
            {tasks.map((task) => (
              <div key={task.id} className={`text-gray-700 border border-gray-900 p-3 ${priorityColor(task.priority)}`}>
                <p>{task.priority}</p>
                <p>{task.name}</p>
                <p>{task.description}</p>
                <p>{formatDate(task.start_date)}</p>
                <p>{formatDate(task.end_date)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}