package com.andreutp.centromasajes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PopularServiceDTO {
    private String nombre;
    private int cantidad;
}
