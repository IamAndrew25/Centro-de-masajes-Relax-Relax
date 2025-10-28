package com.andreutp.centromasajes.dto;


import lombok.Data;

import java.util.List;

@Data
public class UserWorkerDTO {
    private Long id;
    private String username;
    private String phone;
    private String email;
    private String dni;
    private String especialidad;
    private String estado;
    private Integer experiencia;
    private List<WorkAvailabilityDTO> availability;
}
