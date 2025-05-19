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
    console.log('Adding token to request:', config.url);
  } else {
    console.log('No token found for request:', config.url);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 error for:', error.config.url);
      // Only remove token and redirect if it's not a login request
      if (!error.config.url.includes('/auth/login')) {
        console.log('Removing token and redirecting to login');
        localStorage.removeItem('token');
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired, removing');
            localStorage.removeItem('token');
            setUser(null);
          } else {
            console.log('Setting user from token:', decoded);
            setUser({
              id: decoded.id,
              username: decoded.username,
              email: decoded.email,
              role: decoded.role,
            });
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      const response = await api.post('/auth/login', { username, password });
      const { token, requires2FA } = response.data;
      
      if (!requires2FA) {
        console.log('Login successful, setting token');
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        const userData = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
        };
        setUser(userData);
        // Return both the user data and 2FA status
        return { requires2FA, user: userData };
      }
      
      return { requires2FA };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.replace('/login');
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
  window.location.replace('/login');
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