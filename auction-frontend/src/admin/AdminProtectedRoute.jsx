import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  const location = useLocation();

  if (!admin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute; 