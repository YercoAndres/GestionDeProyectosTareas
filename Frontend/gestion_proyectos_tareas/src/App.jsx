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
import ConfirmAccount from './pages/ConfirmAccount';
import { LoadingProvider } from "./contexts/LoadingContext";



function App() {
  return (
    <>
      <Router>
      <LoadingProvider>
        <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm/" element={<ConfirmAccount />} /> {/* Ruta para confirmar cuenta */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Ruta para Dashboard */}
        <Route path="/dashboard/projects" element={<Projects/>} />
        <Route path="/dashboard/tasks" element={<Tasks/>} />
        <Route path='/dashboard/settings' element={<Settings/>}/>
        </Routes>
        </LoadingProvider>
      </Router>
      <ToastContainer
      position='top-right'
      transition={Zoom}
      autoClose={4000}
      />
    </>
  );
}

export default App
