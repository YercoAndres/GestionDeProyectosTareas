import React from 'react'
import Sidebar from '../components/Sidebar'

export default function Tasks() {
  return (
    <div className="flex">
   <Sidebar/>
    <div className="flex-1 p-10 bg-gray-100">
    <h1 className="text-3xl font-semibold mb-6">Tareas</h1>
    <p>Contenido de las tareas aca se van agregar las tareas a los proyectos.</p>
    </div>

   </div>
  )
}
