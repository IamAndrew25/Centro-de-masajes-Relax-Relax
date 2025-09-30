package com.andreutp.centromasajes.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
