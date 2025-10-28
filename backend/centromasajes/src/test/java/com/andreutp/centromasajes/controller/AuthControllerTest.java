package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.security.LoginRateLimiter;
import com.andreutp.centromasajes.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private AuthService authService;

    @Mock
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
    void testRegister_Success() throws Exception {
        // Arrange
        AuthResponse registerResponse = new AuthResponse();
        registerResponse.setMessage("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)");
        registerResponse.setEmail(registerRequest.getEmail());
        registerResponse.setUsername(registerRequest.getUsername());
        registerResponse.setDni(registerRequest.getDni());
        registerResponse.setRoleId(1L);

        when(authService.register(any(RegisterRequest.class))).thenReturn(registerResponse);

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(authService, times(1)).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_ValidationError() throws Exception {
        // Arrange
        RegisterRequest invalidRequest = new RegisterRequest();
        invalidRequest.setUsername("ab"); // Too short
        invalidRequest.setPassword("123"); // Too short
        invalidRequest.setEmail("invalid-email");
        invalidRequest.setPhone("123"); // Invalid format
        invalidRequest.setDni("123"); // Invalid format

        // Act & Assert
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).register(any(RegisterRequest.class));
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        when(loginRateLimiter.tryAcquire(anyString(), anyDouble())).thenReturn(true);
        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login exitoso"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.roleName").value("USER"));

        verify(loginRateLimiter, times(1)).tryAcquire(anyString(), anyDouble());
        verify(authService, times(1)).login(any(LoginRequest.class));
    }

    @Test
    void testLogin_RateLimitExceeded() throws Exception {
        // Arrange
        when(loginRateLimiter.tryAcquire(anyString(), anyDouble())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());

        verify(loginRateLimiter, times(1)).tryAcquire(anyString(), anyDouble());
        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void testLogin_ValidationError() throws Exception {
        // Arrange
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("invalid-email");
        invalidRequest.setPassword("");

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(authService, never()).login(any(LoginRequest.class));
    }

    @Test
    void testForgotPassword_Success() throws Exception {
        // Arrange
        String requestBody = "{\"email\":\"test@example.com\"}";
        doNothing().when(authService).sendPasswordResetToken(anyString());

        // Act & Assert
        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Se envió un enlace de recuperación al correo"));

        verify(authService, times(1)).sendPasswordResetToken("test@example.com");
    }

    @Test
    void testResetPassword_Success() throws Exception {
        // Arrange
        String requestBody = "{\"token\":\"valid-token\",\"newPassword\":\"newPassword123\"}";
        doNothing().when(authService).resetPassword(anyString(), anyString());

        // Act & Assert
        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contraseña actualizada con éxito"));

        verify(authService, times(1)).resetPassword("valid-token", "newPassword123");
    }
}