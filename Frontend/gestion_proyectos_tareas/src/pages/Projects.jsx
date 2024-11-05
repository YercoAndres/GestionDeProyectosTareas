import React from 'react'
import Sidebar from '../components/Sidebar'

export default function Projects() {
  return (
    <div className="flex">
    <Sidebar/>
     <div className="flex-1 p-10 bg-gray-100">
     <h1 className="text-3xl font-semibold mb-6">Proyectos</h1>
     <p>Contenido de los Proyectos aca se van agregar los proyectos.</p>
     </div>
    </div>
  )
}
