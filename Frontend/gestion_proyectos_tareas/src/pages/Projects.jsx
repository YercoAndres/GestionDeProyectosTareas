import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProyectCard';
import { FaPlus } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';
import jwt_decode from 'jwt-decode'; // Necesario para decodificar el JWT

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    id: null
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(''); // Estado para almacenar el rol del usuario

  useEffect(() => {
    // Decodificar el token y establecer el rol del usuario
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token); // Decodifica el token
      console.log(decoded); // Verifica el contenido del token
      setUserRole(decoded.role); // Establece el rol del usuario
    }

    // Fetch para obtener los proyectos
    fetch('http://localhost:5000/projects', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Verifica los proyectos recibidos
        setProjects(data);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
        setError('Error al cargar los proyectos');
      });

    // Obtener los usuarios para asignar miembros a los proyectos
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleEditProject = (project) => {
    setNewProject(project);
    toggleModal();
  };

  const handleDeleteProject = (projectId) => {
    setProjectToDelete(projectId);
    setConfirmDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:5000/projects/${projectToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(() => {
        setProjects(projects.filter(project => project.id !== projectToDelete));
        setConfirmDialogVisible(false);
      })
      .catch(error => {
        console.error('Error deleting project:', error);
        setConfirmDialogVisible(false);
      });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const method = newProject.id ? 'PUT' : 'POST';
    const url = newProject.id 
      ? `http://localhost:5000/projects/${newProject.id}` 
      : 'http://localhost:5000/projects';
      
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newProject),
    })
      .then(response => response.json())
      .then(data => {
        if (newProject.id) {
          setProjects(projects.map(project => project.id === newProject.id ? data : project));
        } else {
          setProjects([...projects, data]);
        }
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [] });
        toggleModal();
      })
      .catch(error => {
        console.error('Error saving project:', error);
        setError('Error al guardar el proyecto');
      });
  };

  const handleMemberChange = (userId) => {
    setNewProject(prevProject => {
      const members = prevProject.members.includes(userId)
        ? prevProject.members.filter(id => id !== userId)
        : [...prevProject.members, userId];
      return { ...prevProject, members };
    });
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <Sidebar>
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Proyectos</h1>

        {/* Mostrar proyectos solo si el usuario es manager o user */}
        {userRole === 'manager' || userRole === 'user' ? (
          <>
            <button 
              onClick={toggleModal} 
              className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center ${userRole === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={userRole === 'user'} // Deshabilitar el botón si el rol es 'user'
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
                  disableEdit={userRole === 'user'} // Deshabilitar la opción de editar si el rol es 'user'
                  disableDelete={userRole === 'user'} // Deshabilitar la opción de eliminar si el rol es 'user'
                />
              ))}
            </div>
          </>
        ) : (
          <p>No tienes permisos para ver los proyectos.</p> 
        )}

        {/* Modal de creación o edición de proyecto */}
        {showModal && (
          <Modal 
            onClose={toggleModal}
            title={newProject.id ? "Editar Proyecto" : "Agregar Proyecto"}
            buttonText={newProject.id ? "Guardar Cambios" : "Crear Proyecto"}
            onSubmit={handleAddProject}
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

        {/* Diálogo de confirmación para eliminar un proyecto */}
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
