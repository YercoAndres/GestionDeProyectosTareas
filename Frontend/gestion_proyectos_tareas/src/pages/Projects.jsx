import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProyectCard';
import { FaPlus } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog'; // Asegúrate de que la ruta sea correcta
import jwt_decode from 'jwt-decode'; // Asegúrate de tener esta dependencia instalada

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    id: null // Asegúrate de que el id esté inicializado como null
  });
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
    // Restablece el estado de newProject cuando se cierra el modal
    if (!showModal) {
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        members: [],
        id: null // Asegúrate de que el id esté inicializado como null
      });
      setError(null); // Restablece el error
    }
  };

  useEffect(() => {
    // Obtener el rol del usuario desde el token almacenado en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.role);
    }

    fetch('http://localhost:5000/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
      })
      .catch(error => console.error('Error fetching projects:', error));

    // Obtener la lista de usuarios
    fetch('http://localhost:5000/api/users') // Asegúrate de que esta ruta sea correcta
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
  
    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    const projectToAdd = {
      ...newProject,
      members: newProject.members // Solo asigna los miembros seleccionados
    };
  
    if (newProject.id) {
      // Edición de proyecto existente
      fetch(`http://localhost:5000/projects/${newProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Incluye el token en los encabezados
        },
        body: JSON.stringify(projectToAdd),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al editar el proyecto');
        }
        return response.json();
      })
      .then(data => {
        setProjects(projects.map(project => project.id === newProject.id ? { ...projectToAdd, id: newProject.id } : project));
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [], id: null }); // Restablecer el estado
        setError('');
        setShowModal(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al editar el proyecto. Inténtalo de nuevo.');
      });
    } else {
      // Creación de nuevo proyecto
      fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Incluye el token en los encabezados
        },
        body: JSON.stringify(projectToAdd),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al crear el proyecto');
        }
        return response.json();
      })
      .then(data => {
        setProjects([...projects, { ...projectToAdd, id: data.projectId }]);
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [], id: null }); // Restablecer el estado
        setError('');
        setShowModal(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al crear el proyecto. Inténtalo de nuevo.');
      });
    }
  };

  // Función para manejar la selección de miembros
  const handleMemberChange = (memberId) => {
    setNewProject(prev => {
      const members = prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId) // Si ya está seleccionado, quitarlo
        : [...prev.members, memberId]; // Si no está, agregarlo
      return { ...prev, members }; // Actualiza el estado con los miembros
    });
  };

  // Funciones para editar y eliminar proyectos
  const handleEditProject = (project) => {
    setNewProject(project);
    setShowModal(true);
  };
  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setConfirmDialogVisible(true);
  };
  
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      fetch(`http://localhost:5000/projects/${projectToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Incluye el token en los encabezados
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el proyecto');
          }
          setProjects(projects.filter(project => project.id !== projectToDelete));
          setProjectToDelete(null); // Limpiar el ID del proyecto a eliminar
          setConfirmDialogVisible(false); // Ocultar el diálogo de confirmación
        })
        .catch(err => {
          console.error('Error al eliminar el proyecto:', err);
          setError('Error al eliminar el proyecto. Inténtalo de nuevo.'); // Manejo de error
        });
    }
  };
  return (
    <Sidebar>
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Proyectos</h1>
        <button 
          onClick={toggleModal} 
          disabled={userRole === 'user'}
          className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaPlus className="mr-2" /> Agregar Proyecto
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onEdit={() => handleEditProject(project)} 
              onDelete={() => handleDeleteProject(project.id)} 
            />
          ))}
        </div>
        {showModal && (
          <Modal 
            onClose={toggleModal}
            title={newProject.id ? "Editar Proyecto" : "Agregar Proyecto"} // Cambia el título
            buttonText={newProject.id ? "Guardar Cambios" : "Crear Proyecto"} // Cambia el texto del botón
            onSubmit={handleAddProject} // Asegúrate de que esta función maneje el envío
          >
            <form onSubmit={handleAddProject}>
              <input 
                type="text" 
                placeholder="Nombre del Proyecto" 
                value={newProject.name} 
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} 
                required className="border p-2 mb-4 w-full"
              />
              <textarea 
                placeholder="Descripción" 
                value={newProject.description} 
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                className="border p-2 mb-4 w-full"
              />
              <h2>Fecha de Inicio</h2>
              <input 
                type="date" 
                value={newProject.startDate} 
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} 
                required 
                className="border p-2 mb-4 w-full"
              />
              <h2>Fecha de Fin</h2>
              <input 
                type="date" 
                value={newProject.endDate} 
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} 
                required 
                className="border p-2 mb-4 w-full"
              />
              <h3 className="text-lg font-semibold mb-2">Seleccionar Miembros</h3>
              <div className="mb-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id={`user-${user.id}`} 
                      checked={newProject.members.includes(user.id)} 
                      onChange={() => handleMemberChange(user.id)} 
                    />
                    <label htmlFor={`user-${user.id}`} className="ml-2">{user.name}</label>
                  </div>
                ))}
              </div>
            </form>
          </Modal>
        )}
        {confirmDialogVisible && (
          <ConfirmDialog
            message="¿Estás seguro de que deseas eliminar este proyecto?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setConfirmDialogVisible(false)}
          />
        )}
      </div>
    </Sidebar>
  );
};

export default Projects;