import React, { useEffect, useState } from 'react';
import { getClientes, deleteCliente } from '../services/clienteService';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function ListaClientes({ onEdit }) {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    getClientes().then(res => setClientes(res.data));
  }, []);

  const handleDelete = (id) => {
    deleteCliente(id).then(() => setClientes(clientes.filter(c => c.id !== id)));
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nombre</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {clientes.map(cliente => (
          <TableRow key={cliente.id}>
            <TableCell>{cliente.nombre}</TableCell>
            <TableCell>{cliente.email}</TableCell>
            <TableCell>
              <Button onClick={() => onEdit(cliente)}>Editar</Button>
              <Button color="error" onClick={() => handleDelete(cliente.id)}>Eliminar</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
