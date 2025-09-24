package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.dao.IUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private IUserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(IUserRepository.class);
        userService = new UserService(userRepository);
    }

    @Test
    void testGetUserById() {
        UserModel user = new UserModel();
        user.setId(1L);
        user.setUsername("andre");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<UserModel> result = userService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals("andre", result.get().getUsername());
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);

        Boolean deleted = userService.deleteUser(1L);

        assertTrue(deleted);
        verify(userRepository, times(1)).deleteById(1L);
    }
}

