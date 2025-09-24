
import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import bannerImg from '../assets/banner.jpg';
import masaje1 from '../assets/masaje1.jpg';
import masaje2 from '../assets/masaje2.jpg';

export default function Home() {
  return (
    <Box>
      {/* Banner superior */}
      <Box sx={{ width: '100%', height: 220, background: `url(${bannerImg}) center/cover`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* El logo y menú ya están en el Header global */}
      </Box>
      {/* Sección de beneficios con fondo gris y bordes inclinados */}
      <Box sx={{
        mt: -10,
        background: '#444',
        color: '#fff',
        px: { xs: 0, md: 0 },
        py: { xs: 7, md: 10 },
        borderRadius: 0,
        clipPath: 'polygon(0 7%, 100% 0, 100% 93%, 0 100%)',
        minHeight: { xs: 400, md: 420 },
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Box sx={{
          background: '#fff',
          color: '#222',
          borderRadius: 4,
          boxShadow: 6,
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
          width: { xs: '95%', md: '80%' },
          maxWidth: 1100,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 3, md: 6 },
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#222', fontWeight: 600, mb: 2, textAlign: { xs: 'center', md: 'left' } }}>Cuida tu bienestar</Typography>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 17 }}>
                <span style={{ color: '#222', fontSize: 22, marginRight: 10 }}>✔</span>
                Más de 10 técnicas diferentes (relajantes, descontracturantes, deportivos, etc.)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 17 }}>
                <span style={{ color: '#222', fontSize: 22, marginRight: 10 }}>✔</span>
                Fisioterapeutas especializados
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 17 }}>
                <span style={{ color: '#222', fontSize: 22, marginRight: 10 }}>✔</span>
                Para todos los objetivos y necesidades
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 17 }}>
                <span style={{ color: '#222', fontSize: 22, marginRight: 10 }}>✔</span>
                Sesiones de masaje personalizadas
              </li>
            </ul>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button variant="contained" sx={{ background: '#ffb300', color: '#222', fontWeight: 600, borderRadius: 20, px: 5, py: 1.5, fontSize: 17, boxShadow: 2, '&:hover': { background: '#ffa000' } }} href="/planes">Ver tarifas</Button>
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-end' } }}>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3, width: { xs: 140, md: 210 }, height: { xs: 90, md: 140 }, mr: { xs: 0, md: 2 } }}>
              <img src={masaje1} alt="Masaje 1" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3, width: { xs: 140, md: 210 }, height: { xs: 90, md: 140 } }}>
              <img src={masaje2} alt="Masaje 2" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
