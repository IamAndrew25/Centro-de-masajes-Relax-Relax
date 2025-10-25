package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IAppointmentRepository extends JpaRepository<AppointmentModel, Long> {
    List<AppointmentModel> findByUser(UserModel user);

    List<AppointmentModel> findByWorker(UserModel worker);

    boolean existsByWorkerAndAppointmentStart(UserModel worker, java.time.LocalDateTime start);
}
