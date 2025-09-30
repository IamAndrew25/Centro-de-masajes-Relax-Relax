package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.dao.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private final IRoleRepository iroleRepository;


    public RoleService(IRoleRepository iroleRepository) {
        this.iroleRepository = iroleRepository;
    }

    // Listar todos los roles
    public List<RoleModel> getAllRoles() {
        return iroleRepository.findAll();
    }

    // Buscar rol por ID
    public Optional<RoleModel> getRoleById(Long id) {
        return iroleRepository.findById(id);
    }

    // Crear un nuevo rol
    public RoleModel saveRole(RoleModel role) {
        return iroleRepository.save(role);
    }

    // Actualizar un rol
    public RoleModel updateRole(Long id, RoleModel updatedRole) {
        return iroleRepository.findById(id)
                .map(role -> {
                    role.setName(updatedRole.getName());
                    return iroleRepository.save(role);
                })
                .orElseThrow(() -> new RuntimeException("Role no encontrado"));
    }

    // Eliminar un rol
    public void deleteRole(Long id) {
        iroleRepository.deleteById(id);
    }
}
