import React from "react";
import { Link } from "react-router-dom";

const contributors = [
  { name: "Yerco Soto Negrete", link: "https://github.com/YercoAndres" },
  { name: "Gonzalo Veliz Atencia", link: "https://github.com/Gonzaliodas" },
  { name: "Nicolas Concha", link: "#" },
  { name: "Carmen Villafana", link: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-slate-950/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <div className="glass-panel rounded-3xl px-8 py-10 md:px-12">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
            <div className="space-y-5">
              <h3 className="text-3xl font-semibold text-white md:text-4xl">
                Construyamos proyectos memorables juntos
              </h3>
              <p className="max-w-xl text-sm text-slate-200/80">
                ProjectTask te acompana desde la ideacion hasta la entrega final
                con herramientas colaborativas pensadas para equipos que buscan
                eficiencia y claridad.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="primary-button w-full sm:w-auto">
                  Crear cuenta gratuita
                </Link>
                <Link to="/login" className="secondary-button w-full sm:w-auto">
                  Ya tengo una cuenta
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                Contribuidores
              </p>
              <ul className="space-y-3 text-sm text-slate-200/85">
                {contributors.map((person) => (
                  <li key={person.name}>
                    <a
                      href={person.link}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-all duration-200 hover:text-white hover:underline"
                    >
                      {person.name}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/YercoAndres/GestionDeProyectosTareas"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm font-medium text-slate-200/70 transition hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Ver repositorio en GitHub
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-slate-400">
          &copy; {currentYear} ProjectTask. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
