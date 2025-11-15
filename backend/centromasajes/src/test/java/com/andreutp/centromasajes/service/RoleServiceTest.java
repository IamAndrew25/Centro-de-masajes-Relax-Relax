package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.model.RoleModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private IRoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    private RoleModel testRole;

    @BeforeEach
    void setUp() {
        testRole = new RoleModel();
        testRole.setId(1L);
        testRole.setName("USER");
    }

    @Test
    void testGetAllRoles() {
        // Arrange
        RoleModel role2 = new RoleModel();
        role2.setId(2L);
        role2.setName("ADMIN");

        RoleModel role3 = new RoleModel();
        role3.setId(3L);
        role3.setName("WORKER");

        List<RoleModel> roles = Arrays.asList(testRole, role2, role3);
        when(roleRepository.findAll()).thenReturn(roles);

        // Act
        List<RoleModel> result = roleService.getAllRoles();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("USER", result.get(0).getName());
        assertEquals("ADMIN", result.get(1).getName());
        assertEquals("WORKER", result.get(2).getName());
        verify(roleRepository, times(1)).findAll();
    }

    @Test
    void testGetRoleById_Success() {
        // Arrange
        when(roleRepository.findById(1L)).thenReturn(Optional.of(testRole));

        // Act
        Optional<RoleModel> result = roleService.getRoleById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("USER", result.get().getName());
        verify(roleRepository, times(1)).findById(1L);
    }

    @Test
    void testGetRoleById_NotFound() {
        // Arrange
        when(roleRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<RoleModel> result = roleService.getRoleById(999L);

        // Assert
        assertFalse(result.isPresent());
        verify(roleRepository, times(1)).findById(999L);
    }

    @Test
    void testSaveRole_Success() {
        // Arrange
        when(roleRepository.save(any(RoleModel.class))).thenReturn(testRole);

        // Act
        RoleModel result = roleService.saveRole(testRole);

        // Assert
        assertNotNull(result);
        assertEquals("USER", result.getName());
        verify(roleRepository, times(1)).save(testRole);
    }

    @Test
    void testUpdateRole_Success() {
        // Arrange
        RoleModel updatedRole = new RoleModel();
        updatedRole.setName("SUPER_ADMIN");

        when(roleRepository.findById(1L)).thenReturn(Optional.of(testRole));
        when(roleRepository.save(any(RoleModel.class))).thenReturn(testRole);

        // Act
        RoleModel result = roleService.updateRole(1L, updatedRole);

        // Assert
        assertNotNull(result);
        assertEquals("SUPER_ADMIN", result.getName());
        verify(roleRepository, times(1)).findById(1L);
        verify(roleRepository, times(1)).save(testRole);
    }

    @Test
    void testUpdateRole_NotFound() {
        // Arrange
        RoleModel updatedRole = new RoleModel();
        updatedRole.setName("SUPER_ADMIN");

        when(roleRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            roleService.updateRole(999L, updatedRole);
        });

        assertEquals("Role no encontrado", exception.getMessage());
        verify(roleRepository, never()).save(any(RoleModel.class));
    }

    @Test
    void testDeleteRole() {
        // Arrange
        doNothing().when(roleRepository).deleteById(1L);

        // Act
        roleService.deleteRole(1L);

        // Assert
        verify(roleRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteRole_VerifyDeletion() {
        // Arrange
        Long roleId = 1L;

        // Act
        roleService.deleteRole(roleId);

        // Assert
        verify(roleRepository, times(1)).deleteById(roleId);
    }
}