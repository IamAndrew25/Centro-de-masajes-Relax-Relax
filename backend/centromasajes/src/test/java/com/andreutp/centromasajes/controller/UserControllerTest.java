package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.security.CustomUserDetailsService;
import com.andreutp.centromasajes.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@SpringBootTest
//@AutoConfigureMockMvc
public class UserControllerTest {
/*
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private IRoleRepository roleRepository;

    @Test
    void testGetUserById() throws Exception {
        UserModel user = new UserModel();
        user.setId(1L);
        user.setUsername("andre");

        when(userService.getById(1L)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/user/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("andre"));
    }*/

}
