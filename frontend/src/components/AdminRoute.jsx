import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const AdminRoute = () => {
  const { user, loading } = useSelector((state) => state.user);
  
  // Mostrar un loader mientras se verifica la autenticación
  if (loading) {
    return <Loader />;
  }
  
  // Verificar autenticación y permisos
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
  
  // Verificar si es administrador
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Renderizar los componentes hijos si todo está bien
  return <Outlet />;
};

export default AdminRoute; 