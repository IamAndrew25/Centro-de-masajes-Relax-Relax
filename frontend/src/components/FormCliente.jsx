import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button } from '@mui/material';

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
});

export default function FormCliente({ onSubmit, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Nombre"
        {...register('nombre')}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Guardar
      </Button>
    </form>
  );
}
