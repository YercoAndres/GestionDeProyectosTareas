// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

export const fetchProjects = async () => {
  const response = await fetch(`${API_URL}/projects`);
  if (!response.ok) {
    throw new Error('Error fetching projects');
  }
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`);
  if (!response.ok) {
    throw new Error('Error fetching users');
  }
  return response.json();
};

export const createProject = async (project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error('Error creating project');
  }
  return response.json();
};

export const updateProject = async (projectId, project) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error('Error updating project');
  }
  return response.json();
};

export const deleteProject = async (projectId) => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error deleting project');
  }
  return response.json();
};