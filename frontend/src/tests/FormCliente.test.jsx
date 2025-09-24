import { render, screen, fireEvent } from '@testing-library/react';
import FormCliente from '../components/FormCliente';

test('muestra error si nombre está vacío', async () => {
  render(<FormCliente onSubmit={jest.fn()} />);
  fireEvent.click(screen.getByText(/Guardar/i));
  expect(await screen.findByText(/El nombre es obligatorio/i)).toBeInTheDocument();
});
