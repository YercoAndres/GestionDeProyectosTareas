import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard( ) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectInfo, setProjectInfo] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:5000/projects');
        const usersResponse = await fetch('http://localhost:5000/api/users');
        
        const projectsData = await projectsResponse.json();
        const usersData = await usersResponse.json();

        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSelectChange = (event) => {
    const projectId = event.target.value;
    setSelectedProject(projectId);
    const project = projects.find((p) => p.id === projectId);
    setProjectInfo(project);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center lg:text-left">
          Dashboard
        </h1>

        {/* Tarjetas Responsivas */}
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-5xl text-gray-500 ">
          {/* Total de proyectos */}
          <div className="bg-blue-100 p-6 rounded-3xl shadow-md grid justify-center">
            <p className=" font-bold text-center text-blue-600">{projects.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Proyectos </h2>
            <img src="../public/projecticon.png" loading='lazy' alt="iconProject" className='max-w-15 max-h-10 mx-auto block ' />
            
            
          </div>
          {/* Total de tareas */}
          <div className="bg-green-100 p-6 rounded-3xl shadow-md grid justify-center items-center">
            <p className=" font-bold text-center text-green-600">{projects.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Tareas</h2>
            <img src="../public/taskicon.png" loading='lazy' alt="iconTask" className='max-w-15 max-h-10 mx-auto block' />
          </div>
          {/* Total de usuarios */}
          <div className="bg-amber-50 p-6 rounded-3xl shadow-md grid justify-center items-center">
            <p className=" font-bold text-center text-amber-300">{users.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Miembros Registrados</h2>
            <img src="../public/membersicon.png" loading='lazy' alt="iconMembers" className='max-w-15 max-h-10 mx-auto block' />
          </div>
        </div>

        {/* Selector Responsivo */}
        <div className="bg-white p-8 rounded shadow-md mt-6 max-w-full mx-auto grid justify-center text-gray-500">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
          Elige el proyecto para visualizar el estado:
        </h2>
        <select
          value={selectedProject}
          onChange={handleSelectChange}
          className="max-w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Información del Proyecto Seleccionado */}
      {projectInfo && (
        <div className="bg-white p-8 rounded shadow-md mt-6 max-w-full mx-auto grid justify-center text-gray-500">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
            Información del Proyecto
          </h2>
          <p><strong>Nombre:</strong> {projectInfo.name}</p>
          
          {/* Agrega más campos según sea necesario */}
        </div>
      )}


        {/* Otro Contenido Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">En progreso</h2>
            <select 
              value={selectedProject} 
              onChange={handleSelectChange} 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Tareas</h2>
            <p className="text-2xl font-bold text-center">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Miembros Registrados</h2>
            <p className="text-2xl font-bold text-center">{users.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}