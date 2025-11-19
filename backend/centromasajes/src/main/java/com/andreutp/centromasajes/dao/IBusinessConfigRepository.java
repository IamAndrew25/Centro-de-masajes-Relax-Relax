package com.andreutp.centromasajes.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.andreutp.centromasajes.model.BusinessConfigModel;

@Repository
public interface IBusinessConfigRepository extends JpaRepository<BusinessConfigModel, Long> {
}
