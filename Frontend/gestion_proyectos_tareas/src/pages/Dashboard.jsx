// src/pages/Dashboard.js
import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <p>Contenido del Dashboard.</p>
        {/* Aquí puedes añadir el contenido del dashboard */}
      </div>
    </div>
  );
};

export default Dashboard;
