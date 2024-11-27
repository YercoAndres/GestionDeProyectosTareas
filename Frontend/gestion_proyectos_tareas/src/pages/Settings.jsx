import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

export default function Settings() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6">Configuración de Perfil</h1>
        <div className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Rol
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={!isEditing}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditing ? 'Guardar' : 'Editar Perfil'}
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cambiar Contraseña
            </button>
          </div>
     
        </div>
        {isEditing && user && (
          <EditProfileModal
            user={user}
            setUser={setUser}
            onClose={handleEditToggle}
          />
        )}
        {showPasswordModal && (
          <ChangePasswordModal
            userId={user.id}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
      </div>
    </div>
  );
}