import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

export default function Nosotros() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Nosotros</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Misión</Typography>
          <Typography variant="body2" gutterBottom>
            Brindar experiencias de bienestar únicas mediante masajes de alta calidad con terapeutas certificados, facilitando reservas y pagos digitales a través de nuestra plataforma web y móvil. Combatir el estrés, mejorar la salud integral y promover el equilibrio personal.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Visión</Typography>
          <Typography variant="body2" gutterBottom>
            Ser la plataforma líder de masajes y bienestar en el país, reconocida por la innovación tecnológica y el compromiso con la salud integral. Ofrecemos acceso a primera experiencia profesional, accesible y segura para quienes buscan relajación y armonía.
          </Typography>
        </Grid>
      </Grid>
      <Button variant="contained" color="warning" sx={{ mt: 3 }}>Ver tarifas</Button>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Nuestros especialistas</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography variant="subtitle1">Mg. Carlos Salazar</Typography><Typography variant="body2">Especialista en Rehabilitación Deportiva</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography variant="subtitle1">Lic. Andrea Volsnik</Typography><Typography variant="body2">Terapia física avanzada</Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent><Typography variant="subtitle1">Lic. María Cardinale</Typography><Typography variant="body2">Terapia Manual y Ortopédica</Typography></CardContent></Card>
          </Grid>
        </Grid>
        <Button variant="contained" color="warning" sx={{ mt: 3 }}>Inscríbete hoy</Button>
      </Box>
    </Box>
  );
}
