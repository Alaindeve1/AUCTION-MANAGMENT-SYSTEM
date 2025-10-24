import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 404:
          console.error('Resource not found:', response.data);
          break;
        case 500:
          console.error('Server error:', response.data);
          break;
        default:
    console.error('API Error:', {
      url: error.config?.url,
            status: response.status,
      message: error.message,
            response: response.data
    });
      }
    }
    return Promise.reject(error);
  }
);

export default api; 