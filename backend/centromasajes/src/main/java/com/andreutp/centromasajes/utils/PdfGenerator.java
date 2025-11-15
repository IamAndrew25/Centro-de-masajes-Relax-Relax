package com.andreutp.centromasajes.utils;


import com.itextpdf.barcodes.BarcodeQRCode;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalTime;

public class PdfGenerator {

    private static final Logger logger = LoggerFactory.getLogger(PdfGenerator.class);

    public static byte[] generateInvoicePdf(String customerName, String invoiceNumber, double total) {
        logger.info("Generando PDF para la boleta {}", invoiceNumber);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Encabezado
            document.add(new Paragraph("CENTRO DE MASAJES RELAXTOTAL")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Boleta N°: " + invoiceNumber));
            document.add(new Paragraph("Cliente: " + customerName));
            document.add(new Paragraph("Total: S/ " + total));
            document.add(new Paragraph("Fecha de emisión: " + java.time.LocalDate.now()));

            document.add(new Paragraph("\nGracias por su preferencia ❤<3"));

            document.close();
            logger.info("PDF generado correctamente para la boleta {}", invoiceNumber);
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF: " + e.getMessage(), e);
        }
    }


        //----------------------------------TESTEO DE DISENOS!!!--------------------------------------
    // -------------------------------------------
    // METODO ESTATICO (boleta demo tipo ticket)
    // -------------------------------------------
    public static byte[] generateSampleTicketPdf() {
        return generateStyledInvoicePdf(
                "ANA MIRLO",
                "1234567",
                "Paquete matrimonial",
                1,
                280.00,
                "Tarjeta Visa",
                "23568716"
        );
    }


    // -------------------------------------------
    // METODO DINÁMICO (boleta con diseño)
    // -------------------------------------------
    public static byte[] generateStyledInvoicePdf(String customerName, String invoiceNumber,
                                                  String description, int quantity,
                                                  double total, String paymentMethod,
                                                  String orderNumber) {
        logger.info("Generando boleta PDF estilo ticket para cliente {}", customerName);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            PageSize ticket = new PageSize(220, 600);
            Document document = new Document(pdf, ticket);
            document.setMargins(20, 20, 20, 20);

            Color negro = new DeviceRgb(40, 40, 40);

            // Logo
            try {
                String logoPath = "C:\\Users\\Usuario\\Desktop\\PROYECTO INTEGRADOR I\\Centro-de-masajes-Relax-Relax\\Front-End\\src\\assets\\images\\logo.png";
                ImageData imageData = ImageDataFactory.create(logoPath);
                Image logo = new Image(imageData).scaleToFit(50, 50);
                logo.setHorizontalAlignment(HorizontalAlignment.CENTER);
                document.add(logo);
            } catch (Exception e) {
                logger.warn("No se encontró el logo - igual pasa sin imagenxd");
            }

            // Encabezado
            document.add(new Paragraph("Relax Total").setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(14)
                    .setFontColor(negro));
            document.add(new Paragraph("RUC: 56879513478")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10));
            document.add(new Paragraph("Av. El buen mar 125 - Azerbaiyán")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10));

            document.add(lineSeparator());

            // Boleta info
            document.add(new Paragraph("Boleta Electrónica N° " + invoiceNumber)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10));

            document.add(lineSeparator());

            // Datos cliente
            document.add(new Paragraph("FECHA: " + LocalDate.now() + "   " + LocalTime.now().withNano(0)).setFontSize(9));
            document.add(new Paragraph("CLIENTE: " + customerName).setFontSize(9));
            document.add(new Paragraph("DNI: 78932154").setFontSize(9)); // se puede hacer dinámico

            document.add(lineSeparator());

            // Detalle
            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 3, 2}))
                    .useAllAvailableWidth();
            table.addHeaderCell(cellHeader("CANT"));
            table.addHeaderCell(cellHeader("DESCRIPCIÓN"));
            table.addHeaderCell(cellHeader("MONTO"));

            table.addCell(cellBody(String.valueOf(quantity)));
            table.addCell(cellBody(description));
            table.addCell(cellBody("s/ " + String.format("%.2f", total)));

            document.add(table);

            document.add(lineSeparator());

            // Totales
            Table totals = new Table(UnitValue.createPercentArray(new float[]{2, 1}))
                    .useAllAvailableWidth();
            totals.addCell(cellBody("SUBTOTAL"));
            totals.addCell(cellRight("s/ " + String.format("%.2f", total)));
            totals.addCell(new Cell().add(new Paragraph("TOTAL").setBold()).setBorder(Border.NO_BORDER));
            totals.addCell(cellRight("s/ " + String.format("%.2f", total)));
            totals.addCell(cellBody("Pago con"));
            totals.addCell(cellRight(paymentMethod));
            document.add(totals);

            document.add(lineSeparator());

            // QR code
            BarcodeQRCode qr = new BarcodeQRCode("https://www.relaxTotal.com/orden/" + orderNumber);
            Image qrImage = new Image(qr.createFormXObject(pdf))
                    .setWidth(80)
                    .setHorizontalAlignment(HorizontalAlignment.CENTER);
            document.add(qrImage);

            document.add(new Paragraph("N° ORDEN: " + orderNumber)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9));

            document.add(lineSeparator());

            document.add(new Paragraph("Gracias por preferirnos")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9));
            document.add(new Paragraph("RELAX TOTAL")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBold()
                    .setFontSize(10));
            document.add(new Paragraph("www.RelaxTotal.com")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(9));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando boleta PDF: " + e.getMessage(), e);
        }
    }

    // --- helpers ---
    private static Paragraph lineSeparator() {
        return new Paragraph("-----------------------------------------")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(8)
                .setMarginTop(5)
                .setMarginBottom(5);
    }

    private static Cell cellHeader(String text) {
        return new Cell().add(new Paragraph(text).setBold().setFontSize(9))
                .setBorder(Border.NO_BORDER);
    }

    private static Cell cellBody(String text) {
        return new Cell().add(new Paragraph(text).setFontSize(9))
                .setBorder(Border.NO_BORDER);
    }

    private static Cell cellRight(String text) {
        return new Cell().add(new Paragraph(text)
                        .setTextAlignment(TextAlignment.RIGHT)
                        .setFontSize(9))
                .setBorder(Border.NO_BORDER);
    }

    //FACTURAAA


}
