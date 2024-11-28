import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ProjectModal({ project, task: initialTask, onClose }) {
  const [task, setTask] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: '',
    status: 'en progreso'
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const taskWithProjectId = { ...task, projectId: project.id };

    try {
      const response = await fetch(`http://localhost:5000/tasks${initialTask ? `/${initialTask.id}` : `/${project.id}/tasks`}`, {
        method: initialTask ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithProjectId)
      });

      if (!response.ok) {
        throw new Error(`Error al ${initialTask ? 'editar' : 'agregar'} la tarea`);
      }

      toast.success(`Tarea ${initialTask ? 'editada' : 'agregada'} exitosamente`);
      onClose();

    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error al ${initialTask ? 'editar' : 'agregar'} la tarea`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">{initialTask ? 'Editar Tarea' : 'Agregar Tarea'}</h3>
        <form onSubmit={handleSaveTask}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Título de la Tarea
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={task.name}
              onChange={handleTaskChange}
              placeholder='Ingresa el nombre de la tarea'
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              placeholder='Ingresa la descripción de la tarea'
              value={task.description}
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_date">
              Fecha de Fin
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={task.end_date}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Selecciona una prioridad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={handleTaskChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="en progreso">En Progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              {initialTask ? 'Guardar Cambios' : 'Agregar Tarea'}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}