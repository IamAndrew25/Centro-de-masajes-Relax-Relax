package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.controller.ReportController;
import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dto.InvoiceItem;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.utils.EmailService;
import com.andreutp.centromasajes.utils.ExcelReportGenerator;
import com.andreutp.centromasajes.utils.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class ReportService {
    //REPORTES O SEA MANDAR AL CORREO LOS REPORTES HARE 1 nomas
    @Autowired
    private EmailService emailService;

    @Autowired
    private IPaymentRepository ipaymentRepository;
    @Autowired
    private IServiceRepository serviceRepository;

    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IAppointmentRepository appointmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    //Reporte de Pagos
    public void enviarReportePagosUsuario(Long userId, String correo) {
        logger.info("Preparando reporte de pagos para usuario {}", userId);
        // 1 Obtener los pagos del usuario
        List<PaymentModel> pagos = ipaymentRepository.findAllByUserId(userId);

        if (pagos.isEmpty()) {
            throw new RuntimeException("No hay pagos registrados para este usuario.");
        }

        // 2 Generar Excel
        byte[] excelBytes = ExcelReportGenerator.generarReportePagos(pagos);
        logger.info("Enviando Excel por correo a {}", correo);

        // 3 Enviar por correo
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Pagos",
                "Adjuntamos su reporte de pagos en Excel.",
                excelBytes,
                "ReportePagos.xlsx"
        );
    }

    // Reporte de Clientes cCon correo
    public void enviarReporteClientes(String correo) {
        // Filtrar usuarios que son clientes
        List<UserModel> clientes = userRepository.findByRoleName("USER");

        // Generar Excel
        byte[] excel = ExcelReportGenerator.generarReporteClientes(clientes, appointmentRepository);

        // Enviar correo
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Clientes",
                "Adjunto encontrarás el reporte de clientes en formato Excel.",
                excel,
                "ReporteClientes.xlsx"
        );
    }
    // DESCARGAR PC
    public byte[] generarExcelClientes() {
        List<UserModel> clientes = userRepository.findByRoleName("USER");
        return ExcelReportGenerator.generarReporteClientes(clientes, appointmentRepository);
    }


    // Reporte de Trabajadores CORREO
    public void enviarReporteTrabajadores(String correo) {
        List<UserModel> trabajadores = userRepository.findByRoleName("WORKER");

        byte[] excel = ExcelReportGenerator.generarReporteTrabajadores(trabajadores);

        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Trabajadores",
                "Adjunto encontrarás el reporte de trabajadores en formato Excel.",
                excel,
                "ReporteTrabajadores.xlsx"
        );
    }
    //DESCARGAR PC
    public byte[] generarExcelTrabajadores() {
        List<UserModel> trabajadores = userRepository.findByRoleName("WORKER");
        return ExcelReportGenerator.generarReporteTrabajadores(trabajadores);
    }



    // Reporte de ServiciosCOREO
    public void enviarReporteServicios(String correo) {
        List<ServiceModel> servicios = serviceRepository.findAll();
        byte[] excel = ExcelReportGenerator.generarReporteServicios(servicios);
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Servicios",
                "Adjunto encontrarás el reporte de servicios en formato Excel.",
                excel,
                "ReporteServicios.xlsx"
        );
    }
    // DESCARGAR PC
    public byte[] generarExcelServicios() {
        List<ServiceModel> servicios = serviceRepository.findAll();
        return ExcelReportGenerator.generarReporteServicios(servicios);
    }


    // Repotte de Reservas ALcoreo
    public void enviarReporteReservas(String correo) {
        List<AppointmentModel> reservas = appointmentRepository.findAll(); // o filtrado si quieres
        byte[] excel = ExcelReportGenerator.generarReporteReservas(reservas);

        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Reservas",
                "Adjunto encontrarás el reporte de reservas en formato Excel.",
                excel,
                "ReporteReservas.xlsx"
        );
    }
    //descargar oc
    public byte[] generarExcelReservas() {
        List<AppointmentModel> reservas = appointmentRepository.findAll();
        return ExcelReportGenerator.generarReporteReservas(reservas);
    }


    //PDF CON DISENO AL CORREO BOLETA
    public void enviarBoletaPdf(String correo, String cliente, String descripcion,
                                double total, String metodoPago) {
        logger.info("Generando y enviando boleta PDF a {}", correo);

        // Generar PDF con diseño       EL METODO Q TIENE DINSEO SE PUEDE CMABIAR PAR PROBAR EN TEXTO PLANO Y
        byte[] pdfBytes = PdfGenerator.generateStyledInvoicePdf(
                cliente,
                "B" + System.currentTimeMillis(), // número de boleta único
                descripcion,
                1,
                total,
                metodoPago,
                String.valueOf(System.currentTimeMillis())
        );

        // Enviar por correo
        emailService.enviarCorreoConAdjunto(
                correo,
                "Boleta de pago - Relax Total",
                "Adjuntamos su boleta electrónica. ¡Gracias por su preferencia!",
                pdfBytes,
                "BoletaRelaxTotal.pdf"
        );

        logger.info("Boleta PDF enviada correctamente a {}", correo);
    }


    // PDF CON DISEÑO AL CORREO FACTURA - MODO SIMPLE (1 ITEM)
public void enviarFacturaPdf(String correo,
                             String cliente,
                             String descripcion,
                             double total,
                             String metodoPago,
                             Integer cantidad,
                             String numeroPedido) {

    logger.info("Generando y enviando FACTURA PDF (1 ítem) a {}", correo);

    // Cantidad segura (mínimo 1)
    int qty = (cantidad == null || cantidad <= 0) ? 1 : cantidad;

    // Método de pago por defecto Visa si viene vacío
    String metodoPagoSeguro = (metodoPago == null || metodoPago.isBlank())
            ? "Visa"
            : metodoPago;

    // Número de factura generado internamente
    String numeroFactura = "F" + System.currentTimeMillis();

    // Pedido opcional
    String pedido = (numeroPedido == null || numeroPedido.isBlank())
            ? null
            : numeroPedido;

    // Usa el método A4 de un solo ítem (que ahora por dentro llama al multi-items)
    byte[] pdfBytes = PdfGenerator.generateInvoiceA4Pdf(
            cliente,
            numeroFactura,
            descripcion,
            qty,
            total,
            metodoPagoSeguro,
            pedido
    );

    emailService.enviarCorreoConAdjunto(
            correo,
            "Factura electrónica - Relax Total " + numeroFactura,
            "Adjuntamos su factura electrónica. ¡Gracias por su preferencia! 😊",
            pdfBytes,
            "Factura-" + numeroFactura + ".pdf"
    );

    logger.info("Factura PDF (1 ítem) enviada correctamente a {}", correo);
}

    // PDF CON DISEÑO AL CORREO FACTURA-------------------------------- JIJIJI GO LEFT?
   public void enviarFacturaPdfMultiple(String correo,
                                     String cliente,
                                     String metodoPago,
                                     String numeroPedido,
                                     String numeroFactura,
                                     List<ReportController.ItemFacturaDTO> itemsDto) {

    logger.info("Generando FACTURA MULTI-ITEMS para {}", correo);

    String metodoPagoSeguro = (metodoPago == null || metodoPago.isBlank()) ? "Visa" : metodoPago;
    String nroFactura = (numeroFactura == null || numeroFactura.isBlank())
            ? "F" + System.currentTimeMillis()
            : numeroFactura;

    String pedido = (numeroPedido == null || numeroPedido.isBlank()) ? null : numeroPedido;

    // Convertir DTO → InvoiceItem
    List<InvoiceItem> items = itemsDto.stream()
            .map(i -> new InvoiceItem(
                    i.getDescripcion(),
                    i.getCantidad() == null ? 1 : i.getCantidad(),
                    i.getPrecioUnitario() == null ? 0.0 : i.getPrecioUnitario()
            )).toList();

    byte[] pdfBytes = PdfGenerator.generateInvoiceA4MultiItemsPdf(
            cliente,
            nroFactura,
            items,
            metodoPagoSeguro,
            pedido
    );

    emailService.enviarCorreoConAdjunto(
            correo,
            "Factura electrónica - Relax Total " + nroFactura,
            "Adjuntamos su factura electrónica. ¡Gracias por su preferencia!",
            pdfBytes,
            "Factura-" + nroFactura + ".pdf"
    );

    logger.info("Factura MULTI-ITEM enviada correctamente.");
}



}
