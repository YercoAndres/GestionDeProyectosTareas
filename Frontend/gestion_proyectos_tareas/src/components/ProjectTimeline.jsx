import React from "react";

const STATUS_COLORS = {
  Completado: "from-emerald-400 via-emerald-500 to-emerald-600",
  "En Progreso": "from-cyan-400 via-sky-500 to-blue-600",
  "En Pausa": "from-amber-400 via-amber-500 to-orange-600",
  default: "from-slate-300 via-slate-400 to-slate-500",
};

const formatDate = (date) =>
  date
    ? date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Sin fecha";

const ProjectTimeline = ({ items, bounds }) => {
  if (!bounds || items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-200/75">
        No hay suficientes datos para construir la linea de tiempo. Asegurate de
        definir fechas de inicio y fin para tus proyectos.
      </div>
    );
  }

  const rangeMs = bounds.end.getTime() - bounds.start.getTime() || 1;

  const getPosition = (date) => {
    if (!date) return 0;
    const clamped = Math.max(
      bounds.start.getTime(),
      Math.min(bounds.end.getTime(), date.getTime())
    );
    return ((clamped - bounds.start.getTime()) / rangeMs) * 100;
  };

  const getWidth = (start, end) => {
    const startPct = getPosition(start);
    const endPct = Math.max(startPct, getPosition(end) || startPct + 5);
    return Math.max(5, endPct - startPct);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-300/70">
        <span>{formatDate(bounds.start)}</span>
        <span>{bounds.spanDays} dias</span>
        <span>{formatDate(bounds.end)}</span>
      </header>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="absolute inset-y-0 left-0 right-0 grid grid-cols-12 gap-0 opacity-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`grid-${index}`}
              className={index % 2 === 0 ? "bg-white" : "bg-slate-200"}
            />
          ))}
        </div>

        <div className="relative space-y-4">
          {items.map((project) => {
            const startPct = getPosition(project.start);
            const widthPct = getWidth(project.start, project.end);
            const colorClass =
              STATUS_COLORS[project.status] || STATUS_COLORS.default;

            return (
              <div key={project.id} className="space-y-1 text-sm">
                <div className="flex justify-between text-xs font-semibold text-slate-200/80">
                  <span className="truncate pr-3 text-white">
                    {project.name}
                  </span>
                  <span className="text-slate-300/70">
                    {formatDate(project.start)} - {formatDate(project.end)}
                  </span>
                </div>
                <div className="relative h-8 w-full rounded-full bg-slate-900/40">
                  <div
                    className={`absolute top-1/2 h-6 -translate-y-1/2 rounded-full bg-gradient-to-r ${colorClass} shadow-xl`}
                    style={{
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                    }}
                  >
                    <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-white md:block">
                      {project.status || "Sin estado"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
