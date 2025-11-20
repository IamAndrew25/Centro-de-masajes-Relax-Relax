package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserModel,Long> {
    Optional<UserModel> findByUsername(String username);
    Optional<UserModel> findByEmail(String email);
    List<UserModel> findByRoleName(String roleName);
    
    // Método para contar clientes nuevos por rango de fechas
    @Query("SELECT COUNT(u) FROM UserModel u WHERE u.role.name = 'USER' AND u.createdAt BETWEEN :startDate AND :endDate")
    int countByFechaRegistroBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
