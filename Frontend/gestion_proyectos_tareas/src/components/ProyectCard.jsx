import React, { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import ConfirmDialog from './ConfirmDialog';
import { Eye, CirclePlus, Pencil, Trash, SquareX } from 'lucide-react';

const ProjectCard = ({ project, userRole, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${project.id}/tasks`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched tasks:', data);
        setTasks(data || []);
      } else {
        console.error('Error al obtener las tareas:', response.statusText);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };

  useEffect(() => {
    if (showInfo) {
      fetchTasks();
    }
  }, [showInfo]);

  const priorityColor = (priority) => {
    switch (priority) {
      case 'Baja': return 'bg-green-200';
      case 'Media': return 'bg-yellow-200';
      case 'Alta': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        console.log(`Task with id ${taskId} deleted successfully`);
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar la tarea:', errorData.message || response.statusText);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    }
  };
  
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setIsConfirmDialogOpen(false);
  };

  const handleOpenConfirmDialog = (taskId) => {
    setTaskToDelete(taskId);
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="border p-4 rounded-xl shadow-md bg-white  ">
      <h3 className="text-2xl font-bold text-cyan-900">Proyecto: {project.name}</h3>
      {showInfo && (
        <>
          <h3 className="text-xl font-semibold mt-4 mb-4 text-gray-700">Detalles del Proyecto</h3>
          <div className='grid md:grid-cols-2'>
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
              <label className="block text-gray-700 text-sm font-bold mb-2">Miembros:</label>
              {Array.isArray(project.members) && project.members.length > 0 ? (
                <ul className="text-gray-700 list-disc pl-5">
                  {project.members.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No hay miembros asignados.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
              <p className="text-gray-700">{project.status}</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-semibold mb-2">Tareas asignadas al proyecto:</label>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-gray-700 border rounded-lg p-3 shadow-2xl ${priorityColor(task.priority)}`}
                  >
                    <div>

                      <div className='grid grid-cols-2 mb-4'>
                        
                      <p className='font-bold text-xl'>{task.priority}</p>

                      <div className='flex justify-end gap-2'>
                      <button onClick={() => handleOpenModal(task)}>
                          <Pencil size={24} className="inline-block text-blue-600 " />
                        </button>
                        <button onClick={() => handleOpenConfirmDialog(task.id)}>
                          <SquareX size={24} className="inline-block text-red-700" />
                        </button>
                      </div>
                       
                    
                      </div>
                      <div>
                        <label className='font-bold' htmlFor="name">Nombre de la tarea:</label>
                        <p>{task.name}</p>
                      </div>
                      <div>
                        <label className='font-bold' htmlFor="description">Descripción:</label>
                        <p>{task.description}</p>
                      </div>
                      <div>
                        <label className='font-bold' htmlFor="startdate">Fecha de inicio:</label>
                        <p>{formatDate(task.start_date)}</p>
                      </div>
                      <div>
                        <label className='font-bold' htmlFor="enddate">Fecha de fin:</label>
                        <p>{formatDate(task.end_date)}</p>
                      </div>
                      <div>
                      {/* Debemos agregarlo a la BD */}
                        <label className='font-bold' htmlFor="status">Estado:</label>  
                        <p>{task.status}</p>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay tareas asignadas.</p>
              )}
            </div>
          </div>
        </>
      )}
      <div className="mt-10 flex flex-wrap justify-end gap-3">
        <button
          onClick={toggleInfo}
          className={'bg-cyan-800 hover:bg-cyan-950 text-white px-2 py-1 rounded-lg'}
        >
          <Eye size={24} className="inline-block mr-3" />
          {showInfo ? 'Ocultar Proyecto' : 'Ver Proyecto'}
        </button>
        <button
          onClick={() => handleOpenModal()}
          className={'bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg'}
        >
          <CirclePlus size={24} className="inline-block mr-3" />
          Agregar tarea
        </button>
        <button
          onClick={onEdit}
          className={`bg-sky-700 hover:bg-sky-800 text-white px-2 py-1 rounded-lg ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Pencil size={24} className="inline-block mr-3" />
          Editar
        </button>
        <button
          onClick={onDelete}
          className={`bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-lg ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={userRole === 'user'}
        >
          <Trash size={24} className="inline-block mr-3" />
          Eliminar
        </button>
      </div>
      {isModalOpen && (
        <ProjectModal project={project} task={selectedTask} onClose={handleCloseModal} />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas eliminar esta tarea?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default ProjectCard;