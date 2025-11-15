package com.andreutp.centromasajes.dto;

import lombok.Data;

@Data
public class WorkAvailabilityDTO {
    private String day;
    private Boolean activo;
    private String inicio;
    private String fin;
}
