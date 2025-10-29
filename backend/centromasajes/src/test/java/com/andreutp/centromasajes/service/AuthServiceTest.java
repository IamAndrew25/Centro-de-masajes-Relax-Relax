package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dto.AuthResponse;
import com.andreutp.centromasajes.dto.LoginRequest;
import com.andreutp.centromasajes.dto.RegisterRequest;
import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private IRoleRepository roleRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private TokenService tokenService;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private AuthService authService;

    private RoleModel userRole;
    private UserModel testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // CRITICAL: Inyectar manualmente los campos @Autowired que no están en el constructor
        ReflectionTestUtils.setField(authService, "tokenService", tokenService);
        ReflectionTestUtils.setField(authService, "mailSender", mailSender);

        // Setup role
        userRole = new RoleModel();
        userRole.setId(1L);
        userRole.setName("USER");

        // Setup test user
        testUser = new UserModel();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$encodedPassword");
        testUser.setPhone("987654321");
        testUser.setDni("12345678");
        testUser.setRole(userRole);
        testUser.setEnabled(true);

        // Setup register request
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("newuser");
        registerRequest.setPassword("password123");
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setPhone("987654321");
        registerRequest.setDni("87654321");

        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void testRegister_Success() {
        // Arrange
        when(roleRepository.findByName("USER")).thenReturn(userRole);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(UserModel.class))).thenReturn(testUser);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("EL USUARIO HA SIDO CREADO CORRECTAMENTE:)", response.getMessage());
        assertEquals(registerRequest.getEmail(), response.getEmail());
        assertEquals(registerRequest.getUsername(), response.getUsername());
        assertEquals(registerRequest.getDni(), response.getDni());
        assertEquals(userRole.getId(), response.getRoleId());

        verify(roleRepository, times(1)).findByName("USER");
        verify(passwordEncoder, times(1)).encode(registerRequest.getPassword());
        verify(userRepository, times(1)).save(any(UserModel.class));
    }

    @Test
    void testRegister_RoleNotFound() {
        // Arrange
        when(roleRepository.findByName("USER")).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals("EL ROL USER NO SE HA ENCONTARDO EN AL BD", exception.getMessage());
        verify(userRepository, never()).save(any(UserModel.class));
    }

    @Test
    void testLogin_Success() {
        // Arrange
        List<UserModel> users = new ArrayList<>();
        users.add(testUser);

        when(userRepository.findAll()).thenReturn(users);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(any(UserModel.class))).thenReturn("mock.jwt.token");

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Login existoso", response.getMessage());
        assertEquals(testUser.getEmail(), response.getEmail());
        assertEquals(testUser.getUsername(), response.getUsername());
        assertEquals(testUser.getRole().getId(), response.getRoleId());
        assertEquals(testUser.getRole().getName(), response.getRoleName());
        assertEquals("mock.jwt.token", response.getToken());

        verify(userRepository, times(1)).findAll();
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), testUser.getPassword());
        verify(jwtUtil, times(1)).generateToken(testUser);
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(userRepository.findAll()).thenReturn(new ArrayList<>());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Email o contrasena incorrectos :0", exception.getMessage());
        verify(jwtUtil, never()).generateToken(any(UserModel.class));
    }

    @Test
    void testLogin_WrongPassword() {
        // Arrange
        List<UserModel> users = new ArrayList<>();
        users.add(testUser);

        when(userRepository.findAll()).thenReturn(users);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Email o contrasena incorrectos :0", exception.getMessage());
        verify(jwtUtil, never()).generateToken(any(UserModel.class));
    }

    @Test
    void testSendPasswordResetToken_Success() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        doNothing().when(tokenService).storeToken(anyString(), anyString());
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // Act & Assert
        assertDoesNotThrow(() -> {
            authService.sendPasswordResetToken("test@example.com");
        });

        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(tokenService, times(1)).storeToken(anyString(), eq("test@example.com"));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testSendPasswordResetToken_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.sendPasswordResetToken("notfound@example.com");
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(tokenService, never()).storeToken(anyString(), anyString());
    }

    @Test
    void testResetPassword_Success() {
        // Arrange
        String token = "valid-token";
        String newPassword = "newPassword123";

        when(tokenService.validateToken(token)).thenReturn(testUser.getEmail());
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(newPassword)).thenReturn("$2a$10$newEncodedPassword");
        when(userRepository.save(any(UserModel.class))).thenReturn(testUser);
        doNothing().when(tokenService).removeToken(token);

        // Act & Assert
        assertDoesNotThrow(() -> {
            authService.resetPassword(token, newPassword);
        });

        verify(tokenService, times(1)).validateToken(token);
        verify(userRepository, times(1)).findByEmail(testUser.getEmail());
        verify(passwordEncoder, times(1)).encode(newPassword);
        verify(userRepository, times(1)).save(testUser);
        verify(tokenService, times(1)).removeToken(token);
    }

    @Test
    void testResetPassword_InvalidToken() {
        // Arrange
        String token = "invalid-token";
        when(tokenService.validateToken(token)).thenReturn(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.resetPassword(token, "newPassword");
        });

        assertEquals("Token inválido o expirado", exception.getMessage());
        verify(userRepository, never()).save(any(UserModel.class));
    }

    @Test
    void testResetPassword_UserNotFound() {
        // Arrange
        String token = "valid-token";
        when(tokenService.validateToken(token)).thenReturn("notfound@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.resetPassword(token, "newPassword");
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(tokenService, never()).removeToken(anyString());
    }
}