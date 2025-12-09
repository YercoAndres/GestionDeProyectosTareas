const isString = (v) => typeof v === 'string';
const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isDateLike = (v) => {
  if (!v) return true;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
};

const VALID_PROJECT_STATUS = ['En Progreso', 'En Pausa', 'Completado'];
const VALID_TASK_PRIORITY = ['Baja', 'Media', 'Alta'];
const VALID_TASK_ESTADO = ['en progreso', 'completado'];

const validateProjectPayload = (req, res, next) => {
  const { name, description, status, startDate, start_date, endDate, end_date } = req.body || {};
  if (!name || !isString(name) || name.length > 255) {
    return res.status(400).json({ message: 'Nombre de proyecto invalido' });
  }
  if (description && !isString(description)) {
    return res.status(400).json({ message: 'Descripcion invalida' });
  }
  const projStatus = status || 'En Progreso';
  if (projStatus && !VALID_PROJECT_STATUS.includes(projStatus)) {
    return res.status(400).json({ message: 'Estado de proyecto invalido' });
  }
  const sd = startDate || start_date;
  const ed = endDate || end_date;
  if (!isDateLike(sd) || !isDateLike(ed)) {
    return res.status(400).json({ message: 'Fechas invalidas' });
  }
  next();
};

const validateTaskPayload = (req, res, next) => {
  const {
    name,
    description,
    priority,
    estado,
    estimated_hours,
    story_points,
    responsable_id,
    start_date,
    end_date,
  } = req.body || {};

  if (!name || !isString(name) || name.length > 255) {
    return res.status(400).json({ message: 'Nombre de tarea invalido' });
  }
  if (description && !isString(description)) {
    return res.status(400).json({ message: 'Descripcion invalida' });
  }
  if (priority && !VALID_TASK_PRIORITY.includes(priority)) {
    return res.status(400).json({ message: 'Prioridad invalida' });
  }
  if (estado && !VALID_TASK_ESTADO.includes(estado)) {
    return res.status(400).json({ message: 'Estado de tarea invalido' });
  }
  if (estimated_hours !== undefined && estimated_hours !== null && !isNumber(estimated_hours)) {
    return res.status(400).json({ message: 'Horas estimadas invalidas' });
  }
  if (story_points !== undefined && story_points !== null && !Number.isInteger(story_points)) {
    return res.status(400).json({ message: 'Story points invalidos' });
  }
  if (responsable_id !== undefined && responsable_id !== null && !Number.isFinite(Number(responsable_id))) {
    return res.status(400).json({ message: 'Responsable invalido' });
  }
  if (!isDateLike(start_date) || !isDateLike(end_date)) {
    return res.status(400).json({ message: 'Fechas invalidas' });
  }
  next();
};

module.exports = {
  validateProjectPayload,
  validateTaskPayload,
};
