package com.andreutp.centromasajes.dto;

import lombok.Data;

@Data
public class UserClientDTO {
    private Long id;
    private String username;
    private String phone;
    private String email;
    private String ultimaVisita;
    private Integer servicios;
    private String tipoMasaje;
}
