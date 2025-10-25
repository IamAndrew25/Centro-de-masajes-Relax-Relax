package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.PlanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IPlanRepository extends JpaRepository<PlanModel, Long> {
    Optional<PlanModel> findByName(String name);
}
