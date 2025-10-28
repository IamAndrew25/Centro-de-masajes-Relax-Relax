package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.WorkerAvailabilityModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IWorkerAvailabilityRepository extends JpaRepository<WorkerAvailabilityModel, Long> {
    List<WorkerAvailabilityModel> findByWorkerId(Long workerId);

    @Transactional
    void deleteByWorkerId(Long workerId);

}
