import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Validate token and get admin info
      axios.get('/api/admin/validate', {
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

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/admin/login', { username, password });
      const { token, ...adminData } = response.data;
      localStorage.setItem('adminToken', token);
      setAdmin({ ...adminData, token });
      return true;
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 