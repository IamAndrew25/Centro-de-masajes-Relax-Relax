package com.andreutp.centromasajes.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    private Long userId;
    private Long workerId;
    private Long serviceId;
    private String status;
    private LocalDateTime appointmentStart;
    private LocalDateTime appointmentEnd;
    private Long userPlanId;
    private String notes;
}
