package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.service.ReportService;
import com.andreutp.centromasajes.utils.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    //Pagos del user por pdf por correo
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

    // ====== NUEVOS ENDPOINTS DE PRUEBA PARA PDF DE PRUEBA ======
    //texto plano vizualiser
    @GetMapping("/boleta/demo")
    public ResponseEntity<byte[]> descargarBoletaDemo() {
        byte[] pdfBytes = PdfGenerator.generateSampleTicketPdf();

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=BoletaDemo.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdfBytes);
    }
    // un poco mas de diseno
    @GetMapping("/boleta/custom")
    public ResponseEntity<byte[]> descargarBoletaDinamica(
            @RequestParam String cliente,
            @RequestParam String descripcion,
            @RequestParam double total,
            @RequestParam String metodoPago,
            @RequestParam(defaultValue = "000123") String factura
    ) {
        byte[] pdfBytes = PdfGenerator.generateStyledInvoicePdf(
                cliente, factura, descripcion, 1, total, metodoPago, "ORD12345"
        );

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=BoletaPersonalizada.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdfBytes);
    }
    //con datos test estaticos pero se puede cambiar los datos estticos al jso nq entrega el front
    @GetMapping("/boleta/test")
    public ResponseEntity<byte[]> descargarBoletaTest() {
        byte[] pdfBytes = PdfGenerator.generateInvoicePdf("Juan Pérez", "INV-TEST-001", 200.50);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=BoletaTest.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdfBytes);
    }

        //metood derek nuevo



    
    //metodo yherson

    // FACTURA: DESCARGA (GET)
@GetMapping("/factura/download")
public ResponseEntity<byte[]> descargarFactura(
        @RequestParam String cliente,
        @RequestParam String descripcion,
        @RequestParam double total,
        @RequestParam String metodoPago,
        @RequestParam(defaultValue = "F000-000001") String numero
) {
    byte[] pdfBytes = PdfGenerator.generateInvoiceA4Pdf(
            cliente, numero, descripcion, 1, total, metodoPago, "ORD-" + System.currentTimeMillis()
    );

    return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=Factura-" + numero + ".pdf")
            .header("Content-Type", "application/pdf")
            .body(pdfBytes);
}

//FACTURA: ENVÍO POR EMAIL (POST JSON) 
@PostMapping("/factura/email")
public ResponseEntity<String> enviarFacturaEmail(@RequestBody FacturaEmailRequest req) {
    reportService.enviarFacturaPdf(
            req.getCorreo(),
            req.getCliente(),
            req.getDescripcion(),
            req.getTotal(),
            req.getMetodoPago()
    );
    return ResponseEntity.accepted().body("Factura enviada a: " + req.getCorreo());
}

// DTO para el body del POST
public static class FacturaEmailRequest {
    private String correo;
    private String cliente;
    private String descripcion;
    private double total;
    private String metodoPago;

    public String getCorreo() { return correo; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
}

}
