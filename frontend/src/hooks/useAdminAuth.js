import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Hook personalizado para verificar la autenticación y permisos de administrador
 * @param {boolean} redirectOnFailure - Si debe redirigir automáticamente cuando falla la autenticación
 * @returns {Object} - Objeto con datos de usuario y estado de autenticación
 */
const useAdminAuth = (redirectOnFailure = true) => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Solo verificar cuando no está cargando
    if (!loading) {
      // Verificar si el usuario está autenticado
      if (!user || !user.token) {
        console.log('Usuario no autenticado');
        if (redirectOnFailure) {
          navigate('/login');
        }
        return;
      }
      
      // Verificar si el usuario es administrador
      if (!user.isAdmin) {
        console.log('Usuario no tiene permisos de administrador');
        if (redirectOnFailure) {
          navigate('/');
        }
      }
    }
  }, [user, loading, navigate, redirectOnFailure]);
  
  return {
    user,
    isAuthenticated: !!(user && user.token),
    isAdmin: !!(user && user.isAdmin),
    loading
  };
};

export default useAdminAuth; 