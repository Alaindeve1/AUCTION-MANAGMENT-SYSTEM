import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, createContext, useContext } from 'react';

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

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, requires2FA } = response.data;
    
    if (!requires2FA) {
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
    }
    
    return { requires2FA };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export individual auth functions
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
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

// Role-based access control
export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
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
    const decoded = jwtDecode(token);
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
    const decoded = jwtDecode(token);
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