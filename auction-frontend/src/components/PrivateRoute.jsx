import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Add token to request headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Make a request to validate the token
        await api.get('/auth/validate');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        // If token is invalid, remove it
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 