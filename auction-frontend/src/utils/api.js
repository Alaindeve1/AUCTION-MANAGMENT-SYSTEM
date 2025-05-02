import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on token validation errors
    if (error.config.url.includes('/auth/validate')) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    // Handle 403 errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // Handle 404 errors
    if (error.response?.status === 404) {
      toast.error('Resource not found');
    }

    // Handle 500 errors
    if (error.response?.status >= 500) {
      toast.error('An unexpected error occurred. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api; 