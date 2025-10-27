package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping("/pagos/{userId}")
    public ResponseEntity<String> enviarReporte(@PathVariable Long userId, @RequestParam String correo) {
        reportService.enviarReportePagosUsuario(userId, correo);
        return ResponseEntity.ok("Reporte enviado al correo: " + correo);
    }
}
