import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import api from '../utils/api';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found in localStorage');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Validating token...');
        
        // Make a request to validate the token
        const response = await api.get('/api/auth/validate', {
          headers: {
            Authorization: `Bearer ${token.trim()}`
          }
        });
        
        console.log('Token validation response:', response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', {
          error,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 