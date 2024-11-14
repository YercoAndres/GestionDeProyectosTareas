import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TaskCalendar from '../components/TaskCalendar';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Aquí puedes hacer peticiones a tu API para obtener los proyectos, tareas y miembros
    const fetchDashboardData = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:5000/api/projects');
        const tasksResponse = await fetch('http://localhost:5000/api/tasks');
        const membersResponse = await fetch('http://localhost:5000/api/members');

        const projectsData = await projectsResponse.json();
        const tasksData = await tasksResponse.json();
        const membersData = await membersResponse.json();

        setProjects(projectsData);
        setTasks(tasksData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchDashboardData();
  }, []);

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

          {/* Total de tareas */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tareas</h2>
            <p className="text-2xl font-bold">{tasks.length}</p>
          </div>

          {/* Total de miembros */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Miembros</h2>
            <p className="text-2xl font-bold">{members.length}</p>
          </div>
        </div>

        <div className="mt-10">
          {/* Lista de proyectos */}
          <h2 className="text-2xl font-semibold mb-4">Proyectos Detallados</h2>
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded shadow-md">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p>{project.description}</p>
                <p className="mt-2"><strong>Fecha de inicio:</strong> {project.start_date}</p>
                <p><strong>Fecha de fin:</strong> {project.end_date}</p>
                <p><strong>Miembros:</strong> {project.members.join(', ')}</p>
                <p><strong>Tareas asociadas:</strong> {tasks.filter(task => task.projectId === project.id).length}</p>
              </div>
            ))}
            <TaskCalendar/>
          </div>
        </div>
      </div>
    </div>
  );
}
