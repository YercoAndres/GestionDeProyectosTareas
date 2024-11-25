import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Tasks({ projectId }) {
  const [tasks, setTasks] = useState([]);

  
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await fetch(`http://localhost:5000/projects/${projectId}/tasks`); // Cambia esta línea
          if (!response.ok) {
            throw new Error('Error al obtener las tareas');
          }
          const tasksData = await response.json();
          setTasks(tasksData);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchTasks();
    }, [projectId]);

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Tareas del Proyecto</h1>

        {/* Total de tareas */}
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Tareas</h2>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>

        {/* Lista de tareas */}
        <div className="grid grid-cols-1 gap-6">
          {tasks.length === 0 ? (
            <p>No hay tareas asignadas a este proyecto.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded shadow-md">
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p>{task.description}</p>
                <p className="mt-2"><strong>Fecha de vencimiento:</strong> {task.due_date}</p>
                <p><strong>Estado:</strong> {task.status}</p>

                <div className="mt-4">
                  {/* Botón para eliminar */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Eliminar
                  </button>

                  {/* Botón para editar */}
                  <button
                    onClick={() => console.log('Editar tarea', task.id)} // Aquí puedes añadir la lógica para abrir un modal de edición
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
