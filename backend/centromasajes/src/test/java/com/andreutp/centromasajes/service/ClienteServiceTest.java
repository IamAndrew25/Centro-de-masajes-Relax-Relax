package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.model.Cliente;
import com.andreutp.centromasajes.repository.ClienteRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class ClienteServiceTest {
    @Test
    void testFindAll() {
        ClienteRepository repo = Mockito.mock(ClienteRepository.class);
        Mockito.when(repo.findAll()).thenReturn(Collections.emptyList());
        ClienteService service = new ClienteService(repo);
        assertTrue(service.findAll().isEmpty());
    }
}
