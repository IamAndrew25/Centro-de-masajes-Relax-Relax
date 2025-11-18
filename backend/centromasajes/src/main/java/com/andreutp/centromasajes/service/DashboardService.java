package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dto.*;
import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.model.AppointmentModel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final IAppointmentRepository appointmentRepository;
    private final IUserRepository userRepository;
    
    /**
     * Obtiene las estadísticas principales del dashboard
     */
    public DashboardStatsDTO getDashboardStats() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate startOfWeek = today.with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
            LocalDate startOfMonth = today.withDayOfMonth(1);
            
            // Reservas de hoy
            int reservasHoy = appointmentRepository.countByFecha(today);
            
            // Reservas de esta semana
            int reservasSemana = appointmentRepository.countByFechaBetween(startOfWeek, today);
            
            // Ingresos del mes actual
            List<AppointmentModel> reservasMes = appointmentRepository.findByFechaBetween(
                startOfMonth.atStartOfDay(),
                today.atTime(23, 59, 59)
            );
            double ingresosMes = reservasMes.stream()
                .filter(r -> r.getStatus() != null && 
                           (r.getStatus().name().equalsIgnoreCase("COMPLETED") || 
                            r.getStatus().name().equalsIgnoreCase("CONFIRMED")))
                .mapToDouble(r -> r.getService() != null ? r.getService().getBaseprice() : 0.0)
                .sum();
            
            // Clientes nuevos este mes
            int clientesNuevos = userRepository.countByFechaRegistroBetween(
                startOfMonth.atStartOfDay(),
                today.atTime(23, 59, 59)
            );
            
            return new DashboardStatsDTO(reservasHoy, reservasSemana, ingresosMes, clientesNuevos);
        } catch (Exception e) {
            // Si hay error, devolver estadísticas en cero
            return new DashboardStatsDTO(0, 0, 0.0, 0);
        }
    }
    
    /**
     * Obtiene las reservas por semana
     */
    public List<WeeklyReservationDTO> getWeeklyReservations(int weeks) {
        LocalDate today = LocalDate.now();
        List<WeeklyReservationDTO> result = new ArrayList<>();
        
        for (int i = weeks - 1; i >= 0; i--) {
            LocalDate weekStart = today.minusWeeks(i).with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
            LocalDate weekEnd = weekStart.plusDays(6);
            
            int count = appointmentRepository.countByFechaBetween(weekStart, weekEnd);
            result.add(new WeeklyReservationDTO("Semana " + (weeks - i), count));
        }
        
        return result;
    }
    
    /**
     * Obtiene los ingresos por mes
     */
    public List<MonthlyRevenueDTO> getMonthlyRevenue(int months) {
        LocalDate today = LocalDate.now();
        List<MonthlyRevenueDTO> result = new ArrayList<>();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.with(TemporalAdjusters.lastDayOfMonth());
            
            List<AppointmentModel> reservasMes = appointmentRepository.findByFechaBetween(
                monthStart.atStartOfDay(),
                monthEnd.atTime(23, 59, 59)
            );
            
            double ingresos = reservasMes.stream()
                .filter(r -> r.getStatus().name().equalsIgnoreCase("COMPLETED") || r.getStatus().name().equalsIgnoreCase("CONFIRMED"))
                .mapToDouble(r -> r.getService() != null ? r.getService().getBaseprice() : 0.0)
                .sum();
            
            String mesNombre = monthStart.getMonth().getDisplayName(TextStyle.FULL, new Locale("es", "ES"));
            result.add(new MonthlyRevenueDTO(mesNombre.substring(0, 1).toUpperCase() + mesNombre.substring(1), ingresos));
        }
        
        return result;
    }
    
    /**
     * Obtiene los servicios más populares
     */
    public List<PopularServiceDTO> getPopularServices(int limit) {
        try {
            LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
            LocalDate today = LocalDate.now();
            
            List<AppointmentModel> reservas = appointmentRepository.findByFechaBetween(
                startOfMonth.atStartOfDay(),
                today.atTime(23, 59, 59)
            );
            
            if (reservas == null || reservas.isEmpty()) {
                return new ArrayList<>();
            }
            
            Map<String, Long> serviceCounts = reservas.stream()
                .filter(r -> r.getService() != null && r.getService().getName() != null)
                .collect(Collectors.groupingBy(
                    r -> r.getService().getName(),
                    Collectors.counting()
                ));
            
            return serviceCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> new PopularServiceDTO(entry.getKey(), entry.getValue().intValue()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    /**
     * Obtiene las reservas recientes
     */
    public List<AppointmentModel> getRecentReservations(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return appointmentRepository.findRecentAppointments(pageable);
    }
}
