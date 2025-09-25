package com.andreutp.centromasajes.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String message;
    private String email;
    private String username;
    private Long roleId;
    private String dni;
    private String token; //campo del token
}
