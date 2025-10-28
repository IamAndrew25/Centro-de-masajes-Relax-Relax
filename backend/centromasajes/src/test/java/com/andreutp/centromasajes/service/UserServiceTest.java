package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dao.IWorkerAvailabilityRepository;
import com.andreutp.centromasajes.dto.UserClientDTO;
import com.andreutp.centromasajes.dto.UserWorkerDTO;
import com.andreutp.centromasajes.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private IUserRepository userRepository;

    @Mock
    private IRoleRepository roleRepository;

    @Mock
    private IAppointmentRepository appointmentRepository;

    @Mock
    private IWorkerAvailabilityRepository availabilityRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserModel testUser;
    private UserModel testWorker;
    private RoleModel userRole;
    private RoleModel workerRole;
    private AppointmentModel testAppointment;
    private ServiceModel testService;
    private WorkerAvailabilityModel availability;

    @BeforeEach
    void setUp() {
        userRole = new RoleModel();
        userRole.setId(1L);
        userRole.setName("USER");

        workerRole = new RoleModel();
        workerRole.setId(2L);
        workerRole.setName("WORKER");

        testUser = new UserModel();
        testUser.setId(1L);
        testUser.setUsername("testUser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$encodedPassword");
        testUser.setPhone("987654321");
        testUser.setDni("12345678");
        testUser.setRole(userRole);
        testUser.setEnabled(true);

        testWorker = new UserModel();
        testWorker.setId(2L);
        testWorker.setUsername("testWorker");
        testWorker.setEmail("worker@example.com");
        testWorker.setPassword("$2a$10$encodedPassword");
        testWorker.setPhone("987654322");
        testWorker.setDni("87654321");
        testWorker.setRole(workerRole);
        testWorker.setEnabled(true);
        testWorker.setEspecialidad("Masaje Relajante");
        testWorker.setEstado("Activo");
        testWorker.setExperiencia(5);

        testService = new ServiceModel();
        testService.setId(1L);
        testService.setName("Masaje Relajante");

        testAppointment = new AppointmentModel();
        testAppointment.setId(1L);
        testAppointment.setUser(testUser);
        testAppointment.setService(testService);
        testAppointment.setAppointmentStart(LocalDateTime.now());

        availability = new WorkerAvailabilityModel();
        availability.setId(1L);
        availability.setDay("Lunes");
        availability.setActivo(true);
        availability.setInicio("09:00");
        availability.setFin("18:00");
        availability.setWorker(testWorker);
    }

    @Test
    void testGetUsers() {
        // Arrange
        List<UserModel> users = Arrays.asList(testUser, testWorker);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        ArrayList<UserModel> result = userService.getUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testSaveUser_WithPlainPassword() {
        // Arrange
        UserModel newUser = new UserModel();
        newUser.setUsername("newUser");
        newUser.setPassword("plainPassword");
        newUser.setEmail("new@example.com");

        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(UserModel.class))).thenReturn(newUser);

        // Act
        UserModel result = userService.saveUser(newUser);

        // Assert
        assertNotNull(result);
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void testSaveUser_WithEncodedPassword() {
        // Arrange
        when(userRepository.save(any(UserModel.class))).thenReturn(testUser);

        // Act
        UserModel result = userService.saveUser(testUser);

        // Assert
        assertNotNull(result);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void testGetById_Success() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        Optional<UserModel> result = userService.getById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetById_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<UserModel> result = userService.getById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void testDeleteUser_Success() {
        // Arrange
        doNothing().when(userRepository).deleteById(1L);

        // Act
        Boolean result = userService.deleteUser(1L);

        // Assert
        assertTrue(result);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUser_Failure() {
        // Arrange
        doThrow(new RuntimeException("Delete failed")).when(userRepository).deleteById(1L);

        // Act
        Boolean result = userService.deleteUser(1L);

        // Assert
        assertFalse(result);
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetClients() {
        // Arrange
        List<UserModel> users = Arrays.asList(testUser);
        List<AppointmentModel> appointments = Arrays.asList(testAppointment);

        when(userRepository.findByRoleName("USER")).thenReturn(users);
        when(appointmentRepository.findByUserIdOrderByAppointmentStartDesc(1L)).thenReturn(appointments);

        // Act
        List<UserClientDTO> result = userService.getClients();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        UserClientDTO dto = result.get(0);
        assertEquals(testUser.getId(), dto.getId());
        assertEquals(testUser.getUsername(), dto.getUsername());
        assertEquals(1, dto.getServicios());
        assertNotNull(dto.getUltimaVisita());

        verify(userRepository, times(1)).findByRoleName("USER");
        verify(appointmentRepository, times(1)).findByUserIdOrderByAppointmentStartDesc(1L);
    }

    @Test
    void testGetClients_NoAppointments() {
        // Arrange
        List<UserModel> users = Arrays.asList(testUser);

        when(userRepository.findByRoleName("USER")).thenReturn(users);
        when(appointmentRepository.findByUserIdOrderByAppointmentStartDesc(1L)).thenReturn(new ArrayList<>());

        // Act
        List<UserClientDTO> result = userService.getClients();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        UserClientDTO dto = result.get(0);
        assertEquals("-", dto.getUltimaVisita());
        assertEquals(0, dto.getServicios());
        assertEquals("-", dto.getTipoMasaje());
    }

    @Test
    void testGetWorkers() {
        // Arrange
        List<UserModel> workers = Arrays.asList(testWorker);
        List<WorkerAvailabilityModel> availabilityList = Arrays.asList(availability);

        when(userRepository.findByRoleName("WORKER")).thenReturn(workers);
        when(availabilityRepository.findByWorkerId(2L)).thenReturn(availabilityList);

        // Act
        List<UserWorkerDTO> result = userService.getWorkers();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        UserWorkerDTO dto = result.get(0);
        assertEquals(testWorker.getId(), dto.getId());
        assertEquals(testWorker.getUsername(), dto.getUsername());
        assertEquals(testWorker.getEspecialidad(), dto.getEspecialidad());
        assertEquals(1, dto.getAvailability().size());

        verify(userRepository, times(1)).findByRoleName("WORKER");
        verify(availabilityRepository, times(1)).findByWorkerId(2L);
    }

    @Test
    void testUpdateWorker_Success() {
        // Arrange
        UserModel updatedWorker = new UserModel();
        updatedWorker.setUsername("updatedWorker");
        updatedWorker.setPassword("newPassword");
        updatedWorker.setEmail("updated@example.com");
        updatedWorker.setPhone("999999999");
        updatedWorker.setDni("11111111");
        updatedWorker.setEnabled(true);
        updatedWorker.setEspecialidad("Masaje Deportivo");
        updatedWorker.setEstado("Activo");
        updatedWorker.setExperiencia(10);

        when(userRepository.findById(2L)).thenReturn(Optional.of(testWorker));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$newEncodedPassword");
        when(userRepository.save(any(UserModel.class))).thenReturn(testWorker);

        // Act
        UserModel result = userService.updateWorker(updatedWorker, 2L);

        // Assert
        assertNotNull(result);
        verify(userRepository, times(1)).findById(2L);
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(testWorker);
    }

    @Test
    void testUpdateWorker_NotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateWorker(testWorker, 999L);
        });

        assertEquals("Trabajador no encontrado", exception.getMessage());
        verify(userRepository, never()).save(any(UserModel.class));
    }

    @Test
    void testSaveWorkerAvailability() {
        // Arrange
        List<WorkerAvailabilityModel> availabilityList = Arrays.asList(availability);

        when(userRepository.findById(2L)).thenReturn(Optional.of(testWorker));
        doNothing().when(availabilityRepository).deleteByWorkerId(2L);
        when(availabilityRepository.save(any(WorkerAvailabilityModel.class))).thenReturn(availability);

        // Act
        userService.saveWorkerAvailability(2L, availabilityList);

        // Assert
        verify(userRepository, times(1)).findById(2L);
        verify(availabilityRepository, times(1)).deleteByWorkerId(2L);
        verify(availabilityRepository, times(1)).save(any(WorkerAvailabilityModel.class));
    }

    @Test
    void testSaveWorkerAvailability_WorkerNotFound() {
        // Arrange
        List<WorkerAvailabilityModel> availabilityList = Arrays.asList(availability);
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.saveWorkerAvailability(999L, availabilityList);
        });

        assertEquals("Trabajador no encontrado", exception.getMessage());
        verify(availabilityRepository, never()).save(any(WorkerAvailabilityModel.class));
    }
}