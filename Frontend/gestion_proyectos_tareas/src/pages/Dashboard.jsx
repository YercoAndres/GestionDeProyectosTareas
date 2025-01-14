import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [projectInfo, setProjectInfo] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsResponse = await fetch(`http://localhost:5000/api/projects`);
        const usersResponse = await fetch(`http://localhost:5000/api/users`);
        const tasksResponse = await fetch(`http://localhost:5000/api/tasks`);

        const projectsData = await projectsResponse.json();
        const usersData = await usersResponse.json();
        const tasksData = await tasksResponse.json();

        setProjects(projectsData);
        setUsers(usersData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);

      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSelectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    const project = projects.find((p) => p.id === projectId);
    setProjectInfo(project);

    const tasksData = Array.isArray(tasks) ? tasks : [];
    const filtered = tasksData.filter((task) => {
      return task.project_id === parseInt(projectId);
    });
    setFilteredTasks(filtered);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-5xl text-gray-500">
          {/* Total de proyectos */}
          <div className="bg-gradient-to-t from-blue-400 via-blue-500 to-blue-600 p-6 rounded-3xl shadow-md grid justify-center">
            <p className="font-bold text-center text-white">{projects.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-white">Proyectos</h2>
            <img src="../assets/projecticon.png" loading="lazy" alt="iconProject" className="max-w-15 max-h-10 mx-auto block" />
          </div>      
          {/* Total de tareas */}
          <div className="bg-gradient-to-t from-green-500 via-green-500 to-green-600 p-6 rounded-3xl shadow-md grid justify-center items-center">
            <p className="font-bold text-center text-white">{tasks.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-white">Tareas</h2>
            <img src="../assets/taskicon.png" loading="lazy" alt="iconTask" className="max-w-15 max-h-10 mx-auto block" />
          </div>

          {/* Total de usuarios */}
          <div className="bg-gradient-to-t from-amber-400 via-amber-500 to-amber-600 p-6 rounded-3xl shadow-md grid justify-center items-center">
            <p className="font-bold text-center text-white">{users.length}</p>
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-white">Miembros Registrados</h2>
            <img src="../assets/membersicon.png" loading="lazy" alt="iconMembers" className="max-w-15 max-h-10 mx-auto block" />
          </div>

        </div>

        {/* Selector Responsivo */}
        <div className="bg-white p-8 rounded-3xl shadow-md mt-6 max-w-full mx-auto grid justify-center text-gray-800">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center ">
            Elige el proyecto para visualizar el estado:
          </h2>
          <select
            value={selectedProject}
            onChange={handleSelectChange}
            className="max-w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Total de tareas del proyecto seleccionado */}
        <div className="bg-cyan-800 p-6 rounded-3xl shadow-md grid justify-center items-center mt-4">
          <p className="font-bold text-center text-white text-5xl">
            {filteredTasks.length}
          </p>

          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-white">
            Tareas del proyecto seleccionado:
          </h2>
          <img src="../assets/taskicon.png" loading="lazy" alt="iconTask" className="max-w-15 max-h-10 mx-auto block" />
        </div>

      </div>
    </div>
  );
}