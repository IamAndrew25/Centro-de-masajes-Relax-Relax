package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.ServiceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IServiceRepository extends JpaRepository<ServiceModel, Long> {
    Optional<ServiceModel> findByName(String name);
}