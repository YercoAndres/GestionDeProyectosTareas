import React from 'react';

export default function About() {
  return (
    <section id='about' className='py-20 bg-white text-black'>
      <div className='container mx-auto flex flex-col items-center'>
        <h1 className='text-4xl font-bold p-2 '>ProjectTask</h1>
        {/* Corrección del enlace de la imagen */}
        <img src="/logo.png" alt="mi_foto" className='w-96 h-72  mb-4 bg-black' />
        <h2 className='text-2xl font-bold'>Sobre Nosotros</h2>

        {/* Añadir texto al párrafo */}
        <p className='text-lg mt-4 max-w-md text-center p-2'>
          Somos una empresa dedicada a la gestión de proyectos, brindando soluciones
          tecnológicas personalizadas a nuestros clientes para que logren sus objetivos
          de manera eficiente.
          Somos una empresa dedicada a la gestión de proyectos, brindando soluciones
          tecnológicas personalizadas a nuestros clientes para que logren sus objetivos
          de manera eficiente.
          Somos una empresa dedicada a la gestión de proyectos, brindando soluciones
          tecnológicas personalizadas a nuestros clientes para que logren sus objetivos
          de manera eficiente.
          Somos una empresa dedicada a la gestión de proyectos, brindando soluciones
          tecnológicas personalizadas a nuestros clientes para que logren sus objetivos
          de manera eficiente.
        </p>
      </div>
    </section>
  );
}
