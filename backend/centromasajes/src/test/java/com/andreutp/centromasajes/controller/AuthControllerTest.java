package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)

public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @Test
    void testRegister() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("andre");
        req.setEmail("andre@example.com");
        req.setPassword("1234");
        req.setDni("12345678");

        AuthResponse resp = new AuthResponse();
        resp.setUsername("andre");
        resp.setEmail("andre@example.com");

        when(authService.register(req)).thenReturn(resp);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"andre\",\"email\":\"andre@example.com\",\"password\":\"1234\",\"dni\":\"12345678\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("andre"));
    }
}
