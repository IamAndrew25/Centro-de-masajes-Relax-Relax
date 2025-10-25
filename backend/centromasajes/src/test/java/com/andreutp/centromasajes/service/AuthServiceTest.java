package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthServiceTest {
    private IUserRepository userRepository;
    private IRoleRepository roleRepository;
    private BCryptPasswordEncoder encoder;
    private AuthService authService;
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        userRepository = mock(IUserRepository.class);
        roleRepository = mock(IRoleRepository.class);
        encoder = new BCryptPasswordEncoder();
        jwtUtil = mock(JwtUtil.class);
        authService = new AuthService(userRepository, roleRepository, encoder, jwtUtil);
    }

    @Test
    void testRegisterUser() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("andre");
        req.setPassword("1234");
        req.setEmail("andre@example.com");
        req.setPhone("999999999");
        req.setDni("12345678");

        RoleModel role = new RoleModel(1L, "USER");
        when(roleRepository.findByName("USER")).thenReturn(role);

        AuthResponse response = authService.register(req);

        assertEquals("andre", response.getUsername());
        assertEquals("andre@example.com", response.getEmail());
        assertEquals("12345678", response.getDni());
    }

    @Test
    void testLoginUser() {
        UserModel user = new UserModel();
        user.setEmail("andre@example.com");
        user.setUsername("andre");
        user.setPassword(encoder.encode("1234"));
        user.setRole(new RoleModel(1L, "USER"));

        when(userRepository.findAll()).thenReturn(java.util.List.of(user));

        LoginRequest req = new LoginRequest();
        req.setEmail("andre@example.com");
        req.setPassword("1234");

        // simulamos que JwtUtil genera un token
        when(jwtUtil.generateToken(any(UserModel.class))).thenReturn("fake-jwt-token");

        AuthResponse response = authService.login(req);

        assertEquals("andre", response.getUsername());
        assertEquals("Login existoso", response.getMessage());
        assertEquals("fake-jwt-token", response.getToken()); // verificamos token
    }
}
