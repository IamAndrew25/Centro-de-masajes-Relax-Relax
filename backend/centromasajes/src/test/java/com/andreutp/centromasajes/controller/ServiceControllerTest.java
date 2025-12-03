package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.security.CustomUserDetailsService;
import com.andreutp.centromasajes.security.JwtUtil;
import com.andreutp.centromasajes.service.ServiceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@WebMvcTest(controllers = ServiceController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
//@AutoConfigureMockMvc(addFilters = false)
class ServiceControllerTest {
/*
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ServiceService serviceService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    private ServiceModel testService;

    @BeforeEach
    void setUp() {
        testService = new ServiceModel();
        testService.setId(1L);
        testService.setName("Masaje Relajante");
        testService.setDescription("Masaje de relajación profunda");
        testService.setDurationMin(60);
        testService.setBaseprice(100.0);
        testService.setActive(true);
    }

    @Test
    void testSaveService_Success() throws Exception {
        // Arrange
        when(serviceService.saveModelService(any(ServiceModel.class))).thenReturn(testService);

        // Act & Assert
        mockMvc.perform(post("/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testService)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Masaje Relajante"))
                .andExpect(jsonPath("$.description").value("Masaje de relajación profunda"))
                .andExpect(jsonPath("$.durationMin").value(60))
                .andExpect(jsonPath("$.baseprice").value(100.0))
                .andExpect(jsonPath("$.active").value(true));

        verify(serviceService, times(1)).saveModelService(any(ServiceModel.class));
    }

    @Test
    void testSaveService_ValidationError() throws Exception {
        // Arrange
        ServiceModel invalidService = new ServiceModel();
        invalidService.setName("AB"); // Demasiado corto (min 3)
        invalidService.setDescription(""); // Vacío
        invalidService.setDurationMin(5); // Menor a 10
        invalidService.setBaseprice(-10.0); // Negativo

        // Act & Assert
        mockMvc.perform(post("/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidService)))
                .andExpect(status().isBadRequest());

        verify(serviceService, never()).saveModelService(any(ServiceModel.class));
    }

    @Test
    void testGetServices_Success() throws Exception {
        // Arrange
        ServiceModel service2 = new ServiceModel();
        service2.setId(2L);
        service2.setName("Masaje Deportivo");
        service2.setDurationMin(90);
        service2.setBaseprice(150.0);

        List<ServiceModel> services = Arrays.asList(testService, service2);
        when(serviceService.getAllService()).thenReturn(services);

        // Act & Assert
        mockMvc.perform(get("/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Masaje Relajante"))
                .andExpect(jsonPath("$[1].name").value("Masaje Deportivo"));

        verify(serviceService, times(1)).getAllService();
    }

    @Test
    void testGetServiceById_Success() throws Exception {
        // Arrange
        when(serviceService.getServiceById(1L)).thenReturn(testService);

        // Act & Assert
        mockMvc.perform(get("/services/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Masaje Relajante"))
                .andExpect(jsonPath("$.durationMin").value(60));

        verify(serviceService, times(1)).getServiceById(1L);
    }

    @Test
    void testGetServiceById_NotFound() throws Exception {
        // Arrange
        when(serviceService.getServiceById(999L))
                .thenThrow(new RuntimeException("no se encontro el servicio"));

        // Act & Assert
        mockMvc.perform(get("/services/999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("no se encontro el servicio"));

        verify(serviceService, times(1)).getServiceById(999L);
    }

    @Test
    void testUpdateServiceById_Success() throws Exception {
        // Arrange
        ServiceModel updatedService = new ServiceModel();
        updatedService.setName("Masaje Relajante Actualizado");
        updatedService.setDescription("Nueva descripción");
        updatedService.setDurationMin(75);
        updatedService.setBaseprice(120.0);
        updatedService.setActive(false);

        when(serviceService.updateService(eq(1L), any(ServiceModel.class)))
                .thenReturn(updatedService);

        // Act & Assert
        mockMvc.perform(put("/services/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedService)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Masaje Relajante Actualizado"))
                .andExpect(jsonPath("$.durationMin").value(75))
                .andExpect(jsonPath("$.baseprice").value(120.0))
                .andExpect(jsonPath("$.active").value(false));

        verify(serviceService, times(1)).updateService(eq(1L), any(ServiceModel.class));
    }

    @Test
    void testUpdateServiceById_NotFound() throws Exception {
        // Arrange
        when(serviceService.updateService(eq(999L), any(ServiceModel.class)))
                .thenThrow(new RuntimeException("no se encontro el servicio"));

        // Act & Assert
        mockMvc.perform(put("/services/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testService)))
                .andExpect(status().isBadRequest());

        verify(serviceService, times(1)).updateService(eq(999L), any(ServiceModel.class));
    }

    @Test
    void testDeleteServiceById_Success() throws Exception {
        // Arrange
        doNothing().when(serviceService).deleteService(1L);

        // Act & Assert
        mockMvc.perform(delete("/services/1"))
                .andExpect(status().isNoContent());

        verify(serviceService, times(1)).deleteService(1L);
    }

    @Test
    void testDeleteServiceById_NotFound() throws Exception {
        // Arrange
        doThrow(new RuntimeException("no se encontro el servicio"))
                .when(serviceService).deleteService(999L);

        // Act & Assert
        mockMvc.perform(delete("/services/999"))
                .andExpect(status().isBadRequest());

        verify(serviceService, times(1)).deleteService(999L);
    }

    @Test
    void testGetServices_EmptyList() throws Exception {
        // Arrange
        when(serviceService.getAllService()).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        verify(serviceService, times(1)).getAllService();
    }*/
}