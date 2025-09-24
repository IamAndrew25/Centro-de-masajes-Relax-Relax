import React from 'react';
import Login from '../components/Login';
import { Box, Typography } from '@mui/material';

export default function LoginPage() {
  const handleLogin = (data) => {
    // Aquí iría la lógica de autenticación
    alert('Login simulado: ' + JSON.stringify(data));
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>Iniciar sesión</Typography>
      <Login onLogin={handleLogin} />
    </Box>
  );
}
