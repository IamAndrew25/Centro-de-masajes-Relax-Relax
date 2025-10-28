package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IAppointmentRepository extends JpaRepository<AppointmentModel, Long> {
    List<AppointmentModel> findByUser(UserModel user);

    List<AppointmentModel> findByWorker(UserModel worker);

    boolean existsByWorkerAndAppointmentStart(UserModel worker, java.time.LocalDateTime start);

    List<AppointmentModel> findByUserIdOrderByAppointmentStartDesc(Long userId);

    List<AppointmentModel> findByWorkerId(Long workerId);

  /*  @Query("SELECT a FROM AppointmentModel a WHERE a.worker.id = :workerId AND FUNCTION('DATE', a.appointmentStart) = :day")
    List<AppointmentModel> findByWorkerIdAndDay(@Param("workerId") Long workerId, @Param("day") LocalDate day);*/

}
