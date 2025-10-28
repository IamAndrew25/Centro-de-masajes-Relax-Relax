package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.RoleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<RoleModel, Long> {
    RoleModel findByName(String name);
   //Optional<RoleModel> Role(String name);

}
