import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verifica si el token existe en localStorage
  const token = localStorage.getItem('token');

  // Si hay token, permite el acceso a las rutas anidadas (hijas) usando <Outlet />
  // Si no hay token, redirige a la página de login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
  // 'replace' evita que el usuario pueda volver atrás a la página protegida sin loguearse
};
//En terminos simples, la pag admin y checkout (para pagar) sean solo para los que iniciaron sesion
export default ProtectedRoute;