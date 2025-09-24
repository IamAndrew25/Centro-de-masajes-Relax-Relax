import React, { useEffect, useState } from 'react';
import { getCliente } from '../services/clienteService';

export default function DetalleCliente({ id }) {
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    getCliente(id).then(res => setCliente(res.data));
  }, [id]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Detalle del Cliente</h2>
      <p><b>Nombre:</b> {cliente.nombre}</p>
      <p><b>Email:</b> {cliente.email}</p>
    </div>
  );
}
