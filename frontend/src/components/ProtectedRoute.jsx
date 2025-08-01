// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // ถ้ายังไม่ login, ให้ redirect ไปที่หน้า login
    return <Navigate to="/login" replace />;
  }

  // ถ้า login แล้ว, ให้แสดงหน้าที่ต้องการ (child route)
  return <Outlet />;
};

export default ProtectedRoute;