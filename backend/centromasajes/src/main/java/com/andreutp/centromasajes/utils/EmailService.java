package com.andreutp.centromasajes.utils;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void enviarBoletaConPDF(String correo, String asunto, String nombreCliente, String numeroBoleta, double total) {

        try {
            byte[] pdfBytes = PdfGenerator.generateInvoicePdf(nombreCliente, numeroBoleta, total);

            // Guardado temporal con Commons IO (opcional)
           /* File tempPdf = new File("boleta_" + numeroBoleta + ".pdf");
            FileUtils.writeByteArrayToFile(tempPdf, pdfBytes);
            logger.info("PDF temporal guardado en {}", tempPdf.getAbsolutePath());*/

            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

            helper.setTo(correo);
            helper.setSubject(asunto);
            helper.setText("Hola " + nombreCliente + ",\nAdjuntamos su boleta electrónica. ¡Gracias por visitarnos!");

            helper.addAttachment("boleta_" + numeroBoleta + ".pdf",
                    new ByteArrayResource(pdfBytes));

            mailSender.send(mensaje);
            logger.info("Correo enviado con PDF a {}", correo);

        } catch (Exception e) {
            logger.error("Error enviando correo con PDF", e);
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }
    public void enviarCorreoConAdjunto(String correo, String asunto, String mensaje, byte[] archivoBytes, String nombreArchivo) {
        try {
            //igual q arriba temporal
            /*File tempFile = new File(nombreArchivo);
            FileUtils.writeByteArrayToFile(tempFile, archivoBytes);
            logger.info("Archivo temporal guardado en {}", tempFile.getAbsolutePath());*/

            MimeMessage email = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(email, true);
            helper.setTo(correo);
            helper.setSubject(asunto);
            helper.setText(mensaje, true);
            helper.addAttachment(nombreArchivo, new ByteArrayResource(archivoBytes));

            mailSender.send(email);
            logger.info("Correo enviado con adjunto {} a {}", nombreArchivo, correo);

        } catch (Exception e) {
            logger.error("Error enviando correo con adjunto", e);
            throw new RuntimeException("Error enviando correo con adjunto: " + e.getMessage(), e);
        }
    }


    public void enviarCorreoSimple(String correo, String asunto, String mensaje) {
        try {
            MimeMessage email = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(email, true);
            helper.setTo(correo);
            helper.setSubject(asunto);
            helper.setText(mensaje, true);
            helper.setFrom("centromasajes@gmail.com");

            mailSender.send(email);
            logger.info("Correo simple enviado a {}", correo);

        } catch (Exception e) {
            logger.error("Error enviando correo simple", e);
            throw new RuntimeException("Error enviando correo: " + e.getMessage(), e);
        }
    }
//--------------Nuevo-----------------------
    public void enviarFacturaA4ConPDF(String correo,
                                  String nombreCliente,
                                  String descripcionServicio,
                                  int cantidad,
                                  double total,
                                  String metodoPago,
                                  String numeroFactura,
                                  String numeroPedido) {
    try {
        byte[] pdfBytes = PdfGenerator.generateInvoiceA4Pdf(
                nombreCliente,
                numeroFactura,
                descripcionServicio,
                cantidad,
                total,
                metodoPago,     // fijado a "Visa" desde el service
                numeroPedido    // puede ser opcional
        );

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);

        helper.setTo(correo);
        helper.setSubject("Factura electrónica " + numeroFactura);
        helper.setText("Hola " + nombreCliente + ",\nAdjuntamos tu factura electrónica. ¡Gracias por tu compra!");

        helper.addAttachment("factura_" + numeroFactura + ".pdf",
                new ByteArrayResource(pdfBytes));

        mailSender.send(mensaje);
        logger.info("Factura A4 enviada a {}", correo);

    } catch (Exception e) {
        logger.error("Error enviando factura A4", e);
        throw new RuntimeException("Error enviando factura: " + e.getMessage(), e);
    }
}

}
