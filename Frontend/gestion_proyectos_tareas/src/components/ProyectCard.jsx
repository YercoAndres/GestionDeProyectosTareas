import React, { useState, useEffect} from 'react';
import ProjectModal from './ProjectModal';
import { Eye, CirclePlus, Pencil, Trash } from 'lucide-react';

     const ProjectCard = ({ project, userRole, onEdit, onDelete, }) => {
      
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [showInfo, setShowInfo] = useState(false);
      const [tasks, setTasks] = useState([]); // Inicialización como arreglo vacío


      const toggleInfo = () => {
        setShowInfo(!showInfo);
      }

            // Función para obtener las tareas desde la API
            const fetchTasks = async () => {
              try {
                const response = await fetch(`http://localhost:5000/tasks/${project.id}/tasks`);
            
                if (response.ok) {
                  const data = await response.json();
                  setTasks(data.tasks || []); // Asegúrate de manejar respuestas sin tareas
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
        }, [showInfo]); // Ejecutar cuando showInfo cambie

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

      const handleOpenModal = () => {
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

  
  return (
      <div className="border p-4 rounded shadow-md bg-white">
          
          <h3 className="text-2xl font-bold text-cyan-900">Proyecto: {project.name}</h3>
        
          
        {showInfo && ( 
              <>
          {/* Titulo */}
          <h3 className="text-xl font-semibold mt-4 mb-4  text-gray-700">Detalles del Proyecto</h3>
        
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
          <p className="text-gray-700">{project.members}</p>
          </div>
           <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2">Prioridad:</label>
             <p className="text-gray-700 pl-3">{project.priority}</p>
           </div>
           <div className="mb-4">
             <label className="block text-gray-700 text-xl font-semibold mb-2">Tareas asignadas al proyecto:</label>
             <div className="grid sm:grid-cols-2 gap-2">
             {Array.isArray(tasks) && tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`text-gray-700 border rounded-lg p-3 ${priorityColor(task.priority)}`}
                    >
                      <p>{task.priority}</p>
                      <p>{task.name}</p>
                      <p>{task.description}</p>
                      <p>{formatDate(task.start_date)}</p>
                      <p>{formatDate(task.end_date)}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay tareas asignadas.</p>
                )}


              </div>
           </div>
           </div>
           </>
           )}
      
          <div className="mt-4 flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
        
        

          <button 
            onClick={toggleInfo} 
            className={`bg-cyan-800 hover:bg-cyan-950 text-white px-2 py-1 rounded ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={userRole === 'user'}
          >
            
            <Eye size={24} className="inline-block mr-3" />
            {showInfo ? 'Ocultar Proyecto' : 'Ver Proyecto'} 
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

      
      </div>
  );
};

export default ProjectCard;