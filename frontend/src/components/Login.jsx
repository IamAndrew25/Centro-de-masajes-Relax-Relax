import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

export default function Login({ onLogin }) {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onLogin)}>
      <TextField label="Usuario" {...register('username')} fullWidth margin="normal" />
      <TextField label="Contraseña" type="password" {...register('password')} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary">Iniciar sesión</Button>
    </form>
  );
}
