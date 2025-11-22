import React from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function ButtonExportProject({ project }) {
  const handleExport = () => {
    if (!project) {
      alert("No hay datos del proyecto para exportar.");
      return;
    }

    const projectData = [
      { Campo: "Nombre del Proyecto", Valor: project.name },
      { Campo: "Descripcion", Valor: project.description },
      { Campo: "Fecha de Inicio", Valor: project.startDate },
      { Campo: "Fecha de Fin", Valor: project.endDate },
      { Campo: "Estado", Valor: project.status },
    ];

    const tasksData =
      project.tasks?.map((task) => ({
        "Nombre de la Tarea": task.name,
        Descripcion: task.description,
        "Fecha de Inicio": task.start_date,
        "Fecha de Fin": task.end_date,
        Prioridad: task.priority,
        Estado: task.estado,
        Responsable: task.responsable,
      })) || [];

    const workbook = XLSX.utils.book_new();
    const projectSheet = XLSX.utils.json_to_sheet(projectData);
    const tasksSheet = XLSX.utils.json_to_sheet(tasksData);

    XLSX.utils.book_append_sheet(workbook, projectSheet, "Proyecto");
    XLSX.utils.book_append_sheet(workbook, tasksSheet, "Tareas");

    XLSX.writeFile(workbook, `${project.name}_export.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-400/20"
    >
      <Download size={18} className="inline-block" />
      Exportar
    </button>
  );
}
