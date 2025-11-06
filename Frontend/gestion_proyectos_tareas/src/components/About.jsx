import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Planificacion inteligente",
    description:
      "Organiza tareas, hitos y responsables con vistas adaptables a tu equipo.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-cyan-300"
      >
        <path d="M19 3h-1V2a1 1 0 0 0-2 0v1H8V2a1 1 0 1 0-2 0v1H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3ZM5 5h1v1a1 1 0 1 0 2 0V5h8v1a1 1 0 0 0 2 0V5h1a1 1 0 0 1 1 1v2H4V6a1 1 0 0 1 1-1Zm14 15H5a1 1 0 0 1-1-1V10h16v9a1 1 0 0 1-1 1Zm-3-7H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Z" />
      </svg>
    ),
  },
  {
    title: "Colaboracion en tiempo real",
    description:
      "Comparte avances, notificaciones y archivos para mantener a todos sincronizados.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-emerald-300"
      >
        <path d="M7 7.5A2.5 2.5 0 1 1 9.5 10 2.5 2.5 0 0 1 7 7.5Zm7 0A2.5 2.5 0 1 1 16.5 10 2.5 2.5 0 0 1 14 7.5ZM5.75 15A2.75 2.75 0 0 0 3 17.75v.534A2.716 2.716 0 0 0 5.688 21h5.624A2.716 2.716 0 0 0 14 18.284v-.534A2.75 2.75 0 0 0 11.25 15Zm12.062-1H18.5A2.5 2.5 0 0 0 16 16.5v1.3a2.7 2.7 0 0 1-1.206 2.232A3.742 3.742 0 0 0 18.5 21h2.25A2.25 2.25 0 0 0 23 18.75v-.661A3.089 3.089 0 0 0 17.812 14Z" />
      </svg>
    ),
  },
  {
    title: "Analitica accionable",
    description:
      "Visualiza indicadores clave para reaccionar rapido ante desviaciones.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 text-indigo-300"
      >
        <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a1 1 0 0 0 .832-1.555l-4-6a1 1 0 0 0-1.664 0l-2.208 3.312-2.168-3.252A1 1 0 0 0 10 13H5V5a2 2 0 0 1 2-2h12a1 1 0 1 0 0-2H7a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a3 3 0 0 0 3-3V5a2 2 0 0 0-2-2Z" />
      </svg>
    ),
  },
];

export default function About() {
  const scrollToSection = (id) => (event) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="relative overflow-hidden pb-24 pt-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/30 to-slate-900/70" />
          <img
            src="../assets/main.jpg"
            alt="hero background"
            className="h-full w-full object-cover opacity-30"
            loading="lazy"
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="glass-panel relative grid gap-12 rounded-3xl px-8 py-12 md:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Plataforma integral
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                Domina cada fase de tus proyectos con claridad y velocidad.
              </h1>
              <p className="max-w-xl text-base text-slate-200 md:text-lg">
                ProjectTask combina planificacion, seguimiento y colaboracion en
                una experiencia simple, enfocada en los resultados y en la
                productividad de tu equipo.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link to="/register" className="primary-button w-full sm:w-auto">
                  Probar ahora
                </Link>
                <a
                  href="#features"
                  onClick={scrollToSection("#features")}
                  className="secondary-button w-full sm:w-auto"
                >
                  Ver caracteristicas
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="glass-panel relative w-full max-w-sm rounded-3xl p-6">
                <div className="absolute -top-4 right-6 rounded-full bg-emerald-400/80 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-lg">
                  Equipos sincronizados
                </div>
                <div className="text-sm text-slate-200">
                  <p className="text-lg font-semibold text-white">
                    Tablero inteligente
                  </p>
                  <p className="mt-2">
                    Visualiza prioridades, estados y entregables en tiempo real.
                    Configura vistas personales y mantente al tanto del progreso.
                  </p>
                  <div className="mt-6 flex items-end justify-between rounded-2xl bg-white/5 p-4">
                    <div>
                      <p className="text-xs uppercase text-slate-300">
                        Progreso semanal
                      </p>
                      <p className="text-3xl font-bold text-white">84%</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="h-12 w-2 rounded-full bg-cyan-400/80" />
                      <span className="h-16 w-2 rounded-full bg-indigo-400/80" />
                      <span className="h-10 w-2 rounded-full bg-emerald-400/80" />
                      <span className="h-14 w-2 rounded-full bg-purple-400/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 pb-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">
                Diseñado para equipos que priorizan resultados
              </h2>
              <p className="mt-3 max-w-2xl text-base text-slate-200/80">
                Desde la planificacion de tareas hasta la entrega final, cada
                herramienta de ProjectTask impulsa la colaboracion y la toma de
                decisiones basada en datos.
              </p>
            </div>
            <a
              href="#aboutinfo"
              onClick={scrollToSection("#aboutinfo")}
              className="secondary-button w-fit"
            >
              Conocer la historia
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-panel flex h-full flex-col gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-200/85">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="aboutinfo" className="relative z-10 pb-24">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white/5 p-8 shadow-2xl lg:p-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6 text-slate-100">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Simple, humano y enfocado en lo que importa
              </h2>
              <p>
                Sabemos que cada proyecto es unico. ProjectTask nacio con el
                proposito de ofrecer una plataforma intuitiva que se adapte a la
                manera de trabajar de los equipos modernos. Construimos
                funcionalidades que eliminan fricciones, facilitan la
                comunicacion y permiten tomar decisiones con seguridad.
              </p>
              <p>
                Creemos que detras de cada logro hay colaboracion efectiva. Por
                eso integramos herramientas para asignar tareas, definir hitos,
                registrar avances y compartir recursos sin abandonar el flujo de
                trabajo central.
              </p>
            </div>
            <div className="glass-panel rounded-3xl p-6">
              <img
                alt="Equipo colaborando"
                src="../assets/aboutmain.jpg"
                loading="lazy"
                className="h-64 w-full rounded-2xl object-cover shadow-2xl"
              />
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <p className="font-semibold uppercase tracking-wide text-cyan-200">
                  Vision del equipo
                </p>
                <p>
                  Nuestro foco es ayudarte a entregar proyectos memorables
                  fomentando la transparencia, la responsabilidad compartida y
                  el aprendizaje continuo.
                </p>
                <Link to="/register" className="primary-button w-full">
                  Crear mi espacio de trabajo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
