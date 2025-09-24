import React, { useState } from 'react';
import ListaClientes from '../components/ListaClientes';
import FormCliente from '../components/FormCliente';
import { createCliente, updateCliente } from '../services/clienteService';
import { Box, Typography, Modal } from '@mui/material';

export default function ClientesPage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleEdit = (cliente) => {
    setEditing(cliente);
    setOpen(true);
  };

  const handleClose = () => {
    setEditing(null);
    setOpen(false);
  };

  const handleSubmit = (data) => {
    if (editing) {
      updateCliente(editing.id, data).then(handleClose);
    } else {
      createCliente(data).then(handleClose);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Clientes</Typography>
      <ListaClientes onEdit={handleEdit} />
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 3, background: '#fff', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
          <FormCliente onSubmit={handleSubmit} defaultValues={editing || {}} />
        </Box>
      </Modal>
    </Box>
  );
}
