import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Button component={Link} to="/">Inicio</Button>
        <Button component={Link} to="/reserva">Reserva</Button>
        <Button component={Link} to="/planes">Planes</Button>
        <Button component={Link} to="/nosotros">Nosotros</Button>
        <Button component={Link} to="/login">Inicia sesión</Button>
      </Toolbar>
    </AppBar>
  );
}
