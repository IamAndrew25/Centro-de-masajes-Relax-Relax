package com.andreutp.centromasajes.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "worker_availability")
@Data
public class WorkerAvailabilityModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "weekday")
    private String day;      // lunes, martes, etc.
    @Column(name = "active")
    private Boolean activo;  // trabaja ese día o no
    @Column(name = "start_time")
    private String inicio;   // hora de inicio HH:mm
    @Column(name = "end_time")
    private String fin;      // hora de fin HH:mm

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private UserModel worker;

}
