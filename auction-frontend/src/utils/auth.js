import axios from 'axios';
import jwt_decode from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  const { token, requires2FA } = response.data;
  
  if (!requires2FA) {
    localStorage.setItem('token', token);
  }
  
  return { requires2FA };
};

export const verify2FA = async (email, code) => {
  const response = await api.post('/auth/verify-2fa', { email, code });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token, newPassword) => {
  return await api.post('/auth/reset-password', { token, newPassword });
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

// Role-based access control
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwt_decode(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const hasPermission = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;

  const roleHierarchy = {
    admin: 3,
    moderator: 2,
    user: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const getUserData = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

// Export the api instance for use in other files
export default api; 