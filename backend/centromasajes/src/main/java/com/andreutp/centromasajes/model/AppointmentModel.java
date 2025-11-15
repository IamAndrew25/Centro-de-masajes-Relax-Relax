package com.andreutp.centromasajes.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private UserModel worker;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceModel service;

    @Column(name = "appointment_start", nullable = false)
    private LocalDateTime appointmentStart;

    @Column(name = "appointment_end", nullable = false)
    private LocalDateTime appointmentEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @ManyToOne
    @JoinColumn(name = "user_plan_id")
    private PlanModel userPlan;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING,
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }
}
