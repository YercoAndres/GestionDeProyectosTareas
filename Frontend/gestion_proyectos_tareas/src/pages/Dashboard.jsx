import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Botón de cerrar sesión */}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;