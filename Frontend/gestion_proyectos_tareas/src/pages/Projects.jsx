import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProyectCard';
import { FaPlus } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';
import jwt_decode from 'jwt-decode';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    status: 'En Progreso',
    id: null
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        members: [],
        status: 'En Progreso',
        id: null
      });
      setError(null);
    }
  };

  useEffect(() => {
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

    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddProject = (e) => {
    e.preventDefault();
  
    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    const projectToAdd = {
      ...newProject,
      members: newProject.members,
      status: newProject.status
    };
  
    if (newProject.id) {
      fetch(`http://localhost:5000/projects/${newProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [], status:'En Progreso', id: null });
        setError('');
        setShowModal(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al editar el proyecto. Inténtalo de nuevo.');
      });
    } else {
      fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [], id: null });
        setError('');
        setShowModal(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al crear el proyecto. Inténtalo de nuevo.');
      });
    }
  };

  const handleMemberChange = (memberId) => {
    setNewProject(prev => {
      const members = prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId];
      return { ...prev, members };
    });
  };

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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar el proyecto');
          }
          setProjects(projects.filter(project => project.id !== projectToDelete));
          setProjectToDelete(null);
          setConfirmDialogVisible(false);
        })
        .catch(err => {
          console.error('Error al eliminar el proyecto:', err);
          setError('Error al eliminar el proyecto. Inténtalo de nuevo.');
        });
    }
  };

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
        
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mt-6 m">
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

          
            <div className='grid grid-cols-1 justify-center'>

            <select name="status" id="status" className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value="">Selecciona una opcion</option>
                    <option value={newProject.status}>En Progreso</option>
                    <option value={newProject.status}>En Pausa</option>
                    <option value={newProject.status}>Completado</option>
            </select>

           
            
              <h3 className="text-lg font-semibold mb-2">Seleccionar Miembros</h3>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="mb-4 p-2 border border-gray-300 rounded"
                />
           </div>
                      


                <div className="mb-4 max-h-64 overflow-y-auto">
                  {filteredUsers.map(user => (
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
              {error && <p className="text-red-500">{error}</p>}
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