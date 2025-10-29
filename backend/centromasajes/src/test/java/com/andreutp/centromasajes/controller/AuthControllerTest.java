package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.security.LoginRateLimiter;
import com.andreutp.centromasajes.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Mocks de servicios
    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private LoginRateLimiter loginRateLimiter;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPhone("987654321");
        registerRequest.setDni("12345678");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        authResponse = new AuthResponse();
        authResponse.setMessage("Login exitoso");
        authResponse.setEmail("test@example.com");
        authResponse.setUsername("testuser");
        authResponse.setRoleId(1L);
        authResponse.setRoleName("USER");
        authResponse.setToken("mock.jwt.token");
    }

    @Test
    @WithMockUser
    void testRegister_Success() throws Exception {
        AuthResponse registerResponse = new AuthResponse();
        registerResponse.setMessage("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)");
        registerResponse.setEmail(registerRequest.getEmail());
        registerResponse.setUsername(registerRequest.getUsername());
        registerResponse.setDni(registerRequest.getDni());
        registerResponse.setRoleId(1L);

        when(authService.register(any(RegisterRequest.class))).thenReturn(registerResponse);

        mockMvc.perform(post("/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    // ✅ Test del login
    @Test
    @WithMockUser
    void testLogin_Success() throws Exception {
        when(loginRateLimiter.tryAcquire(anyString(), anyDouble())).thenReturn(true);
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Login exitoso"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.token").value("mock.jwt.token"));

        verify(loginRateLimiter, times(1)).tryAcquire(anyString(), anyDouble());
        verify(authService, times(1)).login(any(LoginRequest.class));
    }
}
