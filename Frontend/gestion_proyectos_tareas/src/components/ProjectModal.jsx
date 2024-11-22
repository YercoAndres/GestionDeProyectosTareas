import React, { useState } from 'react';

export default function ProjectModal({ project, onClose }) {
  const [task, setTask] = useState({
    title: '',
    start_date: '',
    assigned_to: ''
  });

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const taskWithProjectId = { ...task, projectId: project.id };

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithProjectId)
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar la tarea');
      }
      
      // Aquí puedes actualizar la lista de tareas en el modal si deseas
      alert('Tarea agregada exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
        <p className="text-gray-700 mb-2"><strong>Descripción:</strong> {project.description}</p>
        <p className="text-gray-700 mb-4"><strong>Miembros:</strong> {project.members.join(', ')}</p>

        <h3 className="text-xl font-semibold mb-4">Agregar Tarea</h3>
        <form onSubmit={handleAddTask}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Título de la Tarea
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_date">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={task.start_date}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assigned_to">
              Miembro Asignado
            </label>
            <input
              type="text"
              id="assigned_to"
              name="assigned_to"
              value={task.assigned_to}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Agregar Tarea
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
