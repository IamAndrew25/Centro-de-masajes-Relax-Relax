import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

export default function Reserva() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Reserva tu sesión</Typography>
      <form>
        <TextField label="Nombre" fullWidth margin="normal" required />
        <TextField label="Email" type="email" fullWidth margin="normal" required />
        <TextField label="Fecha" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label="Hora" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <Button type="submit" variant="contained" color="primary">Reservar</Button>
      </form>
    </Box>
  );
}
