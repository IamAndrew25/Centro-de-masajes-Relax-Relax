import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: 'cursive' }}>
          Relax Total
        </Typography>
        <Button component={Link} to="/reserva">Reserva</Button>
        <Button component={Link} to="/planes">Planes</Button>
        <Button component={Link} to="/nosotros">Nosotros</Button>
        <Button component={Link} to="/login">Inicia sesión</Button>
      </Toolbar>
    </AppBar>
  );
}
