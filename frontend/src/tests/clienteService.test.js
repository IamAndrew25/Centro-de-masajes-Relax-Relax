import * as clienteService from '../services/clienteService';
import api from '../services/api';

jest.mock('../services/api');

describe('clienteService', () => {
  it('getClientes llama a /clientes', async () => {
    api.get.mockResolvedValue({ data: [] });
    await clienteService.getClientes();
    expect(api.get).toHaveBeenCalledWith('/clientes');
  });
});
