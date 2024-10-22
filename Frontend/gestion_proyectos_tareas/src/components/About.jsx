import React from 'react';


export default function About() {
  return (
    <section id='about' className='py-20 bg-white text-black'>
      <div className='container mx-auto flex flex-col items-center px-4'>
        
        {/* Título Principal */}
        <h1 className='text-4xl font-bold p-8 text-center'>Gestión de proyectos y tareas de forma simplificada</h1>
        
        {/* Imagen principal */}
      
        <img src="/main.png" alt="Logo" className='w-full h-96 mb-6' />

        <div className='flex flex-col items-center'>
          
          {/* Texto sobre nosotros */}
          <div className='text-center max-w-3xl'>
            <h2 className='text-2xl font-bold'>Sobre Nosotros</h2>
            <p className='text-lg mt-4 p-2'>
              Somos una empresa dedicada a la gestión de proyectos, brindando soluciones
              tecnológicas personalizadas a nuestros clientes para que logren sus objetivos
              de manera eficiente.
            </p>

            {/* Imágenes de servicios */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
              <div className='flex justify-center'>
                <img src="../public/1.png" alt="Servicio 1" className='w-16 h-16 m-2 animate-pulse' />
              </div>
              <div className='flex justify-center'>
                <img src="../public/2.png" alt="Servicio 2" className='w-16 h-16 m-2 animate-pulse' />
              </div>
              <div className='flex justify-center'>
                <img src="../public/3.png" alt="Servicio 3" className='w-16 h-16 m-2 animate-pulse' />
              </div>
            </div>

            {/* Texto adicional */}
            <p className='text-lg mt-6 p-2'>
              La plataforma que a tu equipo le encantará usar:
              Colabora con todos los equipos y departamentos para tener visibilidad del progreso de tu trabajo.
              Mantén a todos alineados con una plataforma que disfrutarán usar para garantizar una ejecución más ágil.
            </p>
          </div>
          
        </div>
      </div>
    
    </section>
    
  );
}
