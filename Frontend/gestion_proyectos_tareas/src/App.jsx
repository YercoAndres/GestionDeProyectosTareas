import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import ConfirmAccount from "./pages/ConfirmAccount";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
      <Router>
        <ThemeProvider>
          <LoadingProvider>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/confirm/:token" element={<ConfirmAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              <Route path="/dashboard/projects" element={<Projects />} />
              <Route path="/dashboard/tasks" element={<Tasks />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Routes>
          </LoadingProvider>
        </ThemeProvider>
      </Router>
      <ToastContainer position="top-right" transition={Zoom} />
    </>
  );
}

export default App;
