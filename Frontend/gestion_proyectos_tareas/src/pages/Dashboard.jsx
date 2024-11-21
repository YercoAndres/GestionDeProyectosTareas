import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';


export default function Dashboard() {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  //const [tasks, setTasks] = useState([]);
  //const [members, setMembers] = useState([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:5000/projects');
  
        const projectsData = await projectsResponse.json();
        //const tasksResponse = await fetch('http://localhost:5000/tasks');
        //const membersResponse = await fetch('http://localhost:5000/members');
        //const tasksData = await tasksResponse.json();
        //const membersData = await membersResponse.json();

        setProjects(projectsData);
        //setTasks(tasksData);
        //setMembers(membersData);   
 
      } catch (error) {
        setError('Error al cargar los datos');
       
      }
    };

    fetchDashboardData();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedProject(event.target.value);
  }; // cambio de opcion y actualizar

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-3 gap-6">


          {/* Total de proyectos */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Proyectos</h2>
            <p className="text-2xl font-bold">{projects.length}</p>
          </div>

        </div>

        <div className="bg-white p-6 rounded shadow-md">
        <h2>
          Elige el proyecto para visualizar el estado:
        </h2>
        <select 
          value={selectedProject} 
          onChange={handleSelectChange} 
          className="mb-4 p-2 border rounded"
        >
          <option value="">Selecciona un proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      </div>  
    </div>
  );
}