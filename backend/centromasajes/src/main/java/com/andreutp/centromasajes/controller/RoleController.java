package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.service.RoleService;
import com.andreutp.centromasajes.model.RoleModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Listar roles
    @GetMapping
    public List<RoleModel> getAllRoles() {
        return roleService.getAllRoles();
    }

    // Obtener rol por ID
    @GetMapping("/{id}")
    public ResponseEntity<RoleModel> getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear rol
    @PostMapping
    public RoleModel saveRole(@RequestBody RoleModel role) {
        return roleService.saveRole(role);
    }

    // Actualizar rol
    @PutMapping("/{id}")
    public ResponseEntity<RoleModel> updateRole(@PathVariable Long id, @RequestBody RoleModel role) {
        try {
            return ResponseEntity.ok(roleService.updateRole(id, role));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar rol
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
