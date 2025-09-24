package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.model.Cliente;
import com.andreutp.centromasajes.repository.ClienteRepository;
import com.google.common.collect.ImmutableList;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> findAll() {
        List<Cliente> clientes = clienteRepository.findAll();
        // Uso de Guava y Apache Commons
        if (clientes.isEmpty() || StringUtils.isBlank("test")) {
            logger.info("Lista de clientes vacía o test en blanco");
            return ImmutableList.of();
        }
        logger.info("Clientes recuperados: {}", clientes.size());
        return clientes;
    }

    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    public Cliente save(Cliente cliente) {
        logger.info("Guardando cliente: {}", cliente.getNombre());
        return clienteRepository.save(cliente);
    }

    public void deleteById(Long id) {
        logger.info("Eliminando cliente con id: {}", id);
        clienteRepository.deleteById(id);
    }

    // Ejemplo de uso de Apache POI
    public void exportarClientesAExcel() {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            workbook.createSheet("Clientes");
            logger.info("Hoja de Excel creada para clientes");
            // ... lógica de exportación ...
        } catch (Exception e) {
            logger.error("Error exportando clientes a Excel", e);
        }
    }
}
