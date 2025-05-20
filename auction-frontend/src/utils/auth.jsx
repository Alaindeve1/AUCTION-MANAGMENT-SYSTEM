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

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if it's not already the login page
      if (!window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser({ ...response.data, token });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
    setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, ...userData } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', token);
      setUser({ ...userData, token });
      setError(null);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response?.status === 403) {
        setError('Not authorized');
      } else if (error.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Login failed. Please try again.';
        setError(typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please try again.');
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
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

// Export the api instance for use in other files
export default api;

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
    console.error('Error checking authentication:', error);
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
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp > currentTime) {
      return {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      };
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};