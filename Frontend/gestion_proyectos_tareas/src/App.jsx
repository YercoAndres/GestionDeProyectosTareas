import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify'; // Importa el ToastContainer
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard'; // Asegúrate de que la ruta sea correcta



function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para Dashboard */}
        </Routes>
      </Router>
      <ToastContainer
      position='top-center'
      transition={Zoom}
      autoClose={2000}
      />
    </>
  );
}

export default App
