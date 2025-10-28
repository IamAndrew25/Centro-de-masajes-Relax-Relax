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

    //boleras por pdf por correo
    @PostMapping("/pagos/{userId}")
    public ResponseEntity<String> enviarReporte(@PathVariable Long userId, @RequestParam String correo) {
        reportService.enviarReportePagosUsuario(userId, correo);
        return ResponseEntity.ok("Reporte enviado al correo: " + correo);
    }

    // NUEVOS para correos y para descargar xd los q tienen /download son para pc
    @PostMapping("/clientes")
    public ResponseEntity<String> enviarReporteClientes(@RequestParam String correo) {
        reportService.enviarReporteClientes(correo);
        return ResponseEntity.ok("Reporte de clientes enviado al correo: " + correo);
    }

    @GetMapping("/clientes/download")
    public ResponseEntity<byte[]> descargarReporteClientes() {
        byte[] excelBytes = reportService.generarExcelClientes();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=ReporteClientes.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(excelBytes);
    }


    @PostMapping("/trabajadores")
    public ResponseEntity<String> enviarReporteTrabajadores(@RequestParam String correo) {
        reportService.enviarReporteTrabajadores(correo);
        return ResponseEntity.ok("Reporte de trabajadores enviado al correo: " + correo);
    }

    @GetMapping("/trabajadores/download")
    public ResponseEntity<byte[]> descargarReporteTrabajadores() {
        byte[] excelBytes = reportService.generarExcelTrabajadores();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=ReporteTrabajadores.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(excelBytes);
    }


    @PostMapping("/servicios")
    public ResponseEntity<String> enviarReporteServicios(@RequestParam String correo) {
        reportService.enviarReporteServicios(correo);
        return ResponseEntity.ok("Reporte de servicios enviado al correo: " + correo);
    }

    @GetMapping("/servicios/download")
    public ResponseEntity<byte[]> descargarReporteServicios() {
        byte[] excelBytes = reportService.generarExcelServicios();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=ReporteServicios.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(excelBytes);
    }

    @PostMapping("/reservas")
    public ResponseEntity<String> enviarReporteReservas(@RequestParam String correo) {
        reportService.enviarReporteReservas(correo);
        return ResponseEntity.ok("Reporte de reservas enviado al correo: " + correo);
    }

    @GetMapping("/reservas/download")
    public ResponseEntity<byte[]> descargarReporteReservas() {
        byte[] excelBytes = reportService.generarExcelReservas();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=ReporteReservas.xlsx")
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(excelBytes);
    }


}
