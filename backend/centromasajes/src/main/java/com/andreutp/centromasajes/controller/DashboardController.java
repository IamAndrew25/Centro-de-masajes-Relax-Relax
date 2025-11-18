package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.dto.*;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    /**
     * Obtiene las estadísticas principales del dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
    
    /**
     * Obtiene las reservas recientes
     */
    @GetMapping("/reservations/recent")
    public ResponseEntity<List<AppointmentModel>> getRecentReservations(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getRecentReservations(limit));
    }
    
    /**
     * Obtiene los ingresos por mes
     */
    @GetMapping("/revenue/monthly")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam(defaultValue = "6") int months
    ) {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue(months));
    }
    
    /**
     * Obtiene las reservas por semana
     */
    @GetMapping("/reservations/weekly")
    public ResponseEntity<List<WeeklyReservationDTO>> getWeeklyReservations(
            @RequestParam(defaultValue = "4") int weeks
    ) {
        return ResponseEntity.ok(dashboardService.getWeeklyReservations(weeks));
    }
    
    /**
     * Obtiene los servicios más populares
     */
    @GetMapping("/services/popular")
    public ResponseEntity<List<PopularServiceDTO>> getPopularServices(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(dashboardService.getPopularServices(limit));
    }
}
