import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos para el calendario
import Sidebar from '../components/Sidebar';

// Configurar el localizador con moment.js
const localizer = momentLocalizer(moment);

export default function TaskCalendar() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Obtener tareas y proyectos desde la API
    const fetchData = async () => {
      try {
        const taskResponse = await fetch('http://localhost:5000/api/tasks');
        const projectResponse = await fetch('http://localhost:5000/api/projects');
        if (!taskResponse.ok || !projectResponse.ok) {
          throw new Error('Error al obtener los datos');
        }
        const taskData = await taskResponse.json();
        const projectData = await projectResponse.json();
        
        setTasks(taskData);
        setProjects(projectData);
        
        // Convertir tareas y proyectos a formato de eventos
        const allEvents = [
          ...taskData.map(task => ({
            title: task.title,
            start: new Date(task.due_date),
            end: new Date(task.due_date),
            description: task.description,
            status: task.status,
          })),
          ...projectData.map(project => ({
            title: project.name,
            start: new Date(project.start_date),
            end: new Date(project.end_date),
            description: project.description,
            members: project.members,
          }))
        ];

        setEvents(allEvents); // Guardar todos los eventos en el estado
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Calendario de Proyectos y Tareas</h1>
        
        {/* Calendario */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day']} // Vistas disponibles
          tooltipAccessor="description" // Mostrar descripción al pasar el mouse
        />
      </div>
    </div>
  );
}
