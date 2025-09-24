import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';

export default function Pago() {
  const [form, setForm] = useState({ tarjeta: '', vencimiento: '', cvv: '' });
  const [pagado, setPagado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPagado(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Pago por tarjeta</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Datos de la operación</Typography>
            <Typography>Importe: <b>S/ 49</b></Typography>
            <Typography>Negocio: Relaxin</Typography>
            <Typography>N° de pedido: 120364</Typography>
            <Typography>Fecha: 24/08/2025</Typography>
            <Typography>Hora: 11:30</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            {pagado ? (
              <Typography color="success.main">¡Pago realizado con éxito!</Typography>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField label="Número de tarjeta" name="tarjeta" value={form.tarjeta} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Vencimiento" name="vencimiento" value={form.vencimiento} onChange={handleChange} fullWidth margin="normal" required placeholder="MM/AA" />
                <TextField label="CVV" name="cvv" value={form.cvv} onChange={handleChange} fullWidth margin="normal" required />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="outlined" color="secondary" type="button">Cancelar</Button>
                  <Button variant="contained" color="warning" type="submit">Pagar</Button>
                </Box>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
