import { useEffect, useState } from 'react';
import { getClientes } from '../services/clienteService';

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    getClientes().then(res => setClientes(res.data));
  }, []);
  return clientes;
}
