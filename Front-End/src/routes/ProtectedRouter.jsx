import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = () => {
  // Verifica si el token existe en localStorage
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      toast.error("Por favor, inicia sesión para acceder a esta página.", {
        toastId: 'authError'
      });
    }
  }, [token]);

  // Si hay token, permite el acceso a las rutas anidadas (hijas) usando <Outlet />
  // Si no hay token, redirige a la página de login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
  // 'replace' evita que el usuario pueda volver atrás a la página protegida sin loguearse
};
//En terminos simples, la pag admin y checkout (para pagar) sean solo para los que iniciaron sesion
export default ProtectedRoute;