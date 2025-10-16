package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.service.ReportService;
import com.andreutp.centromasajes.service.ServiceExportService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private ServiceExportService serviceExportService;

    @Autowired
    private ReportService reportService;

    /**
     * Endpoint para exportar servicios a Excel
     * GET /api/export/services
     * Descarga: servicios_masajes.xlsx
     */
    @GetMapping("/services")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public void exportServices(HttpServletResponse response) {
        try {
            serviceExportService.exportToExcel(response);
        } catch (IOException e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            try {
                response.getWriter().write("Error al generar el archivo Excel: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * Endpoint para generar reporte mensual completo
     * GET /api/export/report/monthly
     * Descarga: reporte_mensual_YYYY-MM.xlsx
     */
    @GetMapping("/report/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public void exportMonthlyReport(HttpServletResponse response) {
        try {
            reportService.generarReporteMensual(response);
        } catch (IOException e) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            try {
                response.getWriter().write("Error al generar el reporte mensual: " + e.getMessage());
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }

    /**
     * Endpoint de prueba para verificar que el controlador funciona
     */
    @GetMapping("/test")
    public String test() {
        return "✅ Controlador de exportación funcionando correctamente";
    }
}
