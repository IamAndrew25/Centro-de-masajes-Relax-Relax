package com.andreutp.centromasajes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private int reservasHoy;
    private int reservasSemana;
    private double ingresosMes;
    private int clientesNuevos;
}
