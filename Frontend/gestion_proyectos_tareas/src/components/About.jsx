import React from 'react';
import { Link } from "react-router-dom";

export default function About() {

  const goToAboutInfo = (e) => {
    e.preventDefault();
    document.querySelector('#aboutinfo').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative bg-[url(../public/main.jpg)] bg-cover bg-center bg-no-repeat ">
        <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
              Gestion de Proyectos
              <strong className="block font-extrabold text-cyan-600"> Project <span className='text-white'>Task.</span> </strong>
            </h1>
            <p className="mt-4 max-w-lg text-white sm:text-xl/relaxed">
              Transforma tus ideas en proyectos exitosos y lleva a tu equipo al siguiente nivel con la plataforma que organiza, conecta y logra resultados!
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-center">
              <Link to="/register" className="block w-full rounded bg-cyan-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-white hover:text-cyan-600 focus:outline-none focus:ring sm:w-auto">
                Registrate
              </Link>
              <a href="#aboutinfo" onClick={goToAboutInfo} className="aboutinfo block w-full rounded bg-white hover:bg-cyan-600 hover:text-white px-12 py-3 text-sm font-medium text-black-600 shadow focus:outline-none focus:ring sm:w-auto">
                Saber mas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seccion 2 */}
      <section id='aboutinfo'>
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Haciendo Más Simples Tus Proyectos
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden sm:h-80 lg:h-full">
              <img alt="aboutmain" src="aboutmain.jpg" loading='lazy' className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="lg:py-16">
              <article className="space-y-4 text-gray-600">
                <p>
                  En Project Task, creemos que detrás de cada gran logro hay un equipo bien organizado y enfocado. Nuestra plataforma nació para simplificar la gestión de proyectos, optimizar la colaboración y ayudar a los equipos a alcanzar sus objetivos con eficiencia. Diseñamos herramientas modernas y accesibles que se adaptan a las necesidades de cualquier proyecto, desde pequeños emprendimientos hasta grandes organizaciones.
                </p>
                <p>
                  Nuestra misión es transformar la forma en que las personas trabajan juntas, convirtiendo tareas complejas en metas alcanzables. Con Project Task, asignar responsabilidades, planificar fechas clave, monitorear avances y celebrar logros nunca ha sido tan fácil. Estamos comprometidos con ser tu aliado estratégico para llevar tu productividad y la de tu equipo al siguiente nivel.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}