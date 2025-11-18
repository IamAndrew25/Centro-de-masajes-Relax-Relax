package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IAppointmentRepository extends JpaRepository<AppointmentModel, Long> {
    List<AppointmentModel> findByUser(UserModel user);

    List<AppointmentModel> findByWorker(UserModel worker);

    boolean existsByWorkerAndAppointmentStart(UserModel worker, java.time.LocalDateTime start);

    List<AppointmentModel> findByUserIdOrderByAppointmentStartDesc(Long userId);

    List<AppointmentModel> findByWorkerId(Long workerId);

    // Métodos para el Dashboard
    @Query("SELECT COUNT(a) FROM AppointmentModel a WHERE FUNCTION('DATE', a.appointmentStart) = :fecha")
    int countByFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT COUNT(a) FROM AppointmentModel a WHERE FUNCTION('DATE', a.appointmentStart) BETWEEN :startDate AND :endDate")
    int countByFechaBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT a FROM AppointmentModel a WHERE a.appointmentStart BETWEEN :startDate AND :endDate ORDER BY a.appointmentStart DESC")
    List<AppointmentModel> findByFechaBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query(value = "SELECT a FROM AppointmentModel a ORDER BY a.createdAt DESC")
    List<AppointmentModel> findRecentAppointments(org.springframework.data.domain.Pageable pageable);

  /*  @Query("SELECT a FROM AppointmentModel a WHERE a.worker.id = :workerId AND FUNCTION('DATE', a.appointmentStart) = :day")
    List<AppointmentModel> findByWorkerIdAndDay(@Param("workerId") Long workerId, @Param("day") LocalDate day);*/

}
