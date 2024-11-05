import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify'; 
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';



function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para Dashboard */}
        <Route path="/dashboard/projects" element={<Projects/>} />
        <Route path="/dashboard/tasks" element={<Tasks/>} />
        <Route path='/dashboard/settings' element={<Settings/>}/>
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
