import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProyectCard';
import { FaPlus } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    members: []
  });
  const [newMember, setNewMember] = useState('');
  const [error, setError] = useState(null);

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    fetch('http://localhost:5000/projects')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los proyectos');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Agrega esta línea para ver la respuesta del servidor
        setProjects(data); // Asegúrate de que 'data' tenga la estructura correcta
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.startDate || !newProject.endDate) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    const projectToAdd = {
      ...newProject,
      members: newProject.members || [] // Asegúrate de que los miembros se envíen correctamente
    };
  
    fetch('http://localhost:5000/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectToAdd),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la creación del proyecto');
        }
        return response.json();
      })
      .then(data => {
        setProjects([...projects, data]);
        setNewProject({ name: '', description: '', startDate: '', endDate: '', members: [] });
        setNewMember(''); // Limpiar el campo de nuevo miembro
        setShowModal(false);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Error al agregar el proyecto:', err);
      });
  };




  const handleAddMember = () => {
    if (newMember) {
      setNewProject(prev => ({ ...prev, members: [...prev.members, newMember] }));
      setNewMember('');
    }
  };

  return (
    <Sidebar>
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <button 
          onClick={toggleModal} 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <FaPlus className="mr-2" /> Crear Nuevo Proyecto
        </button>
      </div>

      {showModal && (
        <Modal onClose={toggleModal}>
          <h2 className="text-lg font-bold text-blue-600">Crear Nuevo Proyecto</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleAddProject} className="space-y-4">
  <input 
    type="text" 
    placeholder="Nombre del proyecto" 
    value={newProject.name} 
    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} 
    className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition duration-300" 
    required 
  />
  <textarea 
    placeholder="Descripción" 
    value={newProject.description} 
    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
    className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition duration-300" 
  />
  <input 
    type="date" 
    placeholder="Fecha de Inicio" 
    value={newProject.startDate} 
    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} 
    className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition duration-300" 
    required 
  />
  <input 
    type="date" 
    placeholder="Fecha de Fin" 
    value={newProject.endDate} 
    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} 
    className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition duration-300" 
    required 
  />
  <div className="flex items-center">
    <input 
      type="text" 
      placeholder="Agregar miembro" 
      value={newMember} 
      onChange={(e) => setNewMember(e.target.value)} 
      className="border-2 border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-500 transition duration-300" 
    />
    <button 
      type="button" 
      onClick={handleAddMember} 
      className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
    >
      Agregar
    </button>
  </div>
  <ul className="list-disc pl-5">
    {newProject.members.map((member, index) => (
      <li key={index} className="text-gray-700">{member}</li>
    ))}
  </ul>
  <button 
    type="submit" 
    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
  >
    Crear Proyecto
  </button>
</form>
        </Modal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </Sidebar>
  );
};

export default Projects;