package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.security.CustomUserDetailsService;
import com.andreutp.centromasajes.security.JwtAuthenticationFilter;
import com.andreutp.centromasajes.security.JwtUtil;
import com.andreutp.centromasajes.service.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(RoleController.class)
public class RoleControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoleService roleService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetRoleById() throws Exception {
        RoleModel role = new RoleModel(1L, "ADMIN");

        when(roleService.getRoleById(1L)).thenReturn(Optional.of(role));

        mockMvc.perform(get("/roles/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ADMIN"));
    }
}
