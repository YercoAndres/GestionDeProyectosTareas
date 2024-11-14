import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Recupera el ID del usuario desde localStorage

    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${userId}`);
          if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', user);
    setIsEditing(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Configuración de Perfil</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {isEditing ? (
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Editar
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
