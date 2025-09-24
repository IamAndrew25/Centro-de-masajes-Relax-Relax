import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function Planes() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Planes y Tarifas</Typography>
      <Typography variant="body1" gutterBottom>
        Elige el plan que mejor se adapte a tus necesidades y consulta nuestras tarifas personalizadas.
      </Typography>
      <Button variant="contained" color="warning" href="/reserva">Ver tarifas</Button>
    </Box>
  );
}
