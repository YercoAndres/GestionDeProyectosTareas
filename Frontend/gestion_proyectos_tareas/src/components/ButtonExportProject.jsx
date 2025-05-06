import React from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

export default function ButtonExportProject({ project }) {
  const handleExport = () => {
    if (!project) {
      alert("No hay datos del proyecto para exportar.");
      return;
    }

    // Crear los datos para el archivo Excel
    const projectData = [
      { Campo: "Nombre del Proyecto", Valor: project.name },
      { Campo: "Descripción", Valor: project.description },
      { Campo: "Fecha de Inicio", Valor: project.startDate },
      { Campo: "Fecha de Fin", Valor: project.endDate },
      { Campo: "Estado", Valor: project.status },
    ];

    const tasksData =
      project.tasks?.map((task) => ({
        "Nombre de la Tarea": task.name,
        Descripción: task.description,
        "Fecha de Inicio": task.start_date,
        "Fecha de Fin": task.end_date,
        Prioridad: task.priority,
        Estado: task.estado,
        Responsable: task.responsable,
      })) || [];

    // Crear hojas de trabajo
    const workbook = XLSX.utils.book_new();
    const projectSheet = XLSX.utils.json_to_sheet(projectData);
    const tasksSheet = XLSX.utils.json_to_sheet(tasksData);

    // Agregar hojas al libro
    XLSX.utils.book_append_sheet(workbook, projectSheet, "Proyecto");
    XLSX.utils.book_append_sheet(workbook, tasksSheet, "Tareas");

    // Exportar el archivo
    XLSX.writeFile(workbook, `${project.name}_export.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-gray-700 hover:bg-gray-950 text-white px-2 py-1 rounded-lg"
    >
      <Download size={24} className="inline-block" /> Exportar Proyecto
    </button>
  );
}
