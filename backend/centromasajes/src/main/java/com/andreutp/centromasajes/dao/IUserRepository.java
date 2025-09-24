package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserModel,Long> {
    Optional<UserModel> findByUsername(String username);



}
