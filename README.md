#  Gestion de Proyectos y Tareas

Este proyecto es una aplicación web diseñada para facilitar la gestión de proyectos y tareas, desarrollada como proyecto final del segundo año de la carrera de Ingeniería en Informática en AIEP.

# Descripción

La aplicación permite a los usuarios:

Crear y gestionar proyectos: Los usuarios con rol de manager pueden crear nuevos proyectos y asignar tareas a los miembros del equipo.

Visualizar y actualizar tareas: Los miembros del equipo pueden ver las tareas asignadas y actualizar su estado según el progreso.

Colaboración en tiempo real: La plataforma facilita la comunicación y colaboración entre los miembros del equipo para asegurar una gestión eficiente de los proyectos.

Tecnologías Utilizadas

Frontend: Desarrollado con React y Vite para una experiencia de usuario rápida y eficiente. Se utiliza Tailwind CSS para el diseño y estilo de la interfaz.

Backend: Construido con Node.js y Express para manejar las operaciones del servidor. La base de datos utilizada es MySQL para el almacenamiento de datos.

#  Instalación

Frontend

Navega al directorio del frontend:

cd frontend/gestion_proyectos_tareas

Instala las dependencias:

npm install

Inicia la aplicación:

npm run dev

Backend

Navega al directorio del backend:

cd backend

Instala las dependencias:

npm install

Inicia el servidor:

node server.js

#  Uso

Registro: El registro está disponible en la página principal y ahi puedes seleccionar si deseas ser manager o user.

Autenticación: Estamos utilizando autenticacion con JWT y ademas se les envia un token de verificacion de la cuenta.


#  Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo LICENSE en el repositorio.
