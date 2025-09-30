package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)

public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;

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
    }

}
