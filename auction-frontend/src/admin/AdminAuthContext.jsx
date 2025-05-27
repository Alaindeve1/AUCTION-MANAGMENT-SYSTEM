import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token and get admin info
      api.get('/admin/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setAdmin({ ...response.data, token });
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
          setAdmin(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      console.log('Making login request to /admin/auth/login');
      const response = await api.post('/admin/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      if (response.data.requiresTwoFactor) {
        // Return the 2FA data to be handled by the login component
        return {
          requiresTwoFactor: true,
          qrCodeUrl: response.data.qrCodeUrl,
          username: response.data.username
        };
      }

      const { token, ...adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setAdmin({ ...adminData, token });
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('Admin login failed:', error);
      if (error.response?.status === 403) {
        setError('Not authorized as admin');
      } else if (error.response?.status === 401) {
        setError('Invalid credentials');
      } else {
        const errorMessage = error.response?.data?.error || error.response?.data || 'Login failed. Please try again.';
        setError(typeof errorMessage === 'string' ? errorMessage : 'Login failed. Please try again.');
      }
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  }, []);

  const verifyTwoFactor = useCallback(async (username, code) => {
    try {
      console.log('Making 2FA verification request to /admin/auth/verify-2fa');
      const response = await api.post('/admin/auth/verify-2fa', { username, code });
      console.log('2FA verification response:', response.data);
      
      const { token, ...adminData } = response.data;
      localStorage.setItem('adminToken', token);
      const adminState = { ...adminData, token };
      console.log('Setting admin state:', adminState);
      setAdmin(adminState);
      setError(null);
      return { success: true };
    } catch (error) {
      console.error('2FA verification failed:', error);
      const errorMessage = error.response?.data?.error || 'Invalid verification code';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    error,
    login,
    verifyTwoFactor,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 