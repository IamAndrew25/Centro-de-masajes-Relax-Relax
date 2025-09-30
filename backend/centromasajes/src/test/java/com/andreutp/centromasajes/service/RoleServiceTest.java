package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.dao.IRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class RoleServiceTest {

    private IRoleRepository roleRepository;
    private RoleService roleService;

    @BeforeEach
    void setUp() {
        roleRepository = mock(IRoleRepository.class);
        roleService = new RoleService(roleRepository);
    }

    @Test
    void testGetRoleById() {
        RoleModel role = new RoleModel(1L, "ADMIN");
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));

        Optional<RoleModel> result = roleService.getRoleById(1L);

        assertTrue(result.isPresent());
        assertEquals("ADMIN", result.get().getName());
    }

    @Test
    void testSaveRole() {
        RoleModel role = new RoleModel(2L, "USER");
        when(roleRepository.save(role)).thenReturn(role);

        RoleModel result = roleService.saveRole(role);

        assertNotNull(result);
        assertEquals("USER", result.getName());
    }
}
