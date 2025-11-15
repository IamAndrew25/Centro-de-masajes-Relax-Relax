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

    //FACTURAAA

//FACTURAAA

/**
 * Genera una FACTURA en tamaño A4 con datos básicos y un ítem.
 * Mantiene un diseño similar a la boleta con diseño
 */
public static byte[] generateInvoiceA4Pdf(String customerName, String invoiceNumber,
                                          String description, int quantity,
                                          double total, String paymentMethod,
                                          String orderNumber) {

    logger.info("Generando FACTURA PDF A4 para cliente {}", customerName);

    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(40, 40, 40, 40);

       
        Color azulHeader = new DeviceRgb(0, 84, 147);
        Color grisClaro = new DeviceRgb(240, 240, 240);
        Color grisTexto = new DeviceRgb(60, 60, 60);
        Color blanco = new DeviceRgb(255, 255, 255);

        // MARCA DE AGUA (LOGO RELAX TOTAL, CENTRADO Y TRANSPARENTE)
        
        try {
            
            String logoPath = "C:\\Users\\riosb\\Downloads\\Centro-de-masajes-Relax-Relax-branch-Jheremy\\Front-End\\src\\assets\\images\\logo.png";

            ImageData logoData = ImageDataFactory.create(logoPath);
            Image watermark = new Image(logoData);

            // Tamaño de la marca de agua
            float wmWidth = 300f;
            float wmHeight = 300f;
            watermark.scaleToFit(wmWidth, wmHeight);

            // Posición centrada 
            float x = (PageSize.A4.getWidth() - wmWidth) / 2;
            float y = (PageSize.A4.getHeight() - wmHeight) / 2;
            watermark.setFixedPosition(x, y);

            // Transparencia baja
            watermark.setOpacity(0.08f);

            // se agrega ANTES del contenido para que quede "detrás"
            document.add(watermark);
        } catch (Exception e) {
            logger.warn("No se pudo cargar el logo para marca de agua en la factura", e);
        }

        
        // LOGO / NOMBRE + "FACTURA")
        
        Table headerBand = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .useAllAvailableWidth();

        
        Paragraph brand = new Paragraph("Relax Total")
                .setBold()
                .setFontSize(18)
                .setFontColor(blanco);

        Paragraph subBrand = new Paragraph("Centro de Masajes Relax Total")
                .setFontSize(9)
                .setFontColor(blanco);

        Cell brandCell = new Cell()
                .add(brand)
                .add(subBrand)
                .setBackgroundColor(azulHeader)
                .setBorder(Border.NO_BORDER)
                .setPadding(10);

        
        Paragraph facturaLabel = new Paragraph("FACTURA")
                .setBold()
                .setFontSize(14)
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontColor(blanco);

        Paragraph facturaNumber = new Paragraph("N° " + invoiceNumber)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontColor(blanco);

        Cell facturaCell = new Cell()
                .add(facturaLabel)
                .add(facturaNumber)
                .setBackgroundColor(azulHeader)
                .setBorder(Border.NO_BORDER)
                .setPadding(10);

        headerBand.addCell(brandCell);
        headerBand.addCell(facturaCell);

        document.add(headerBand);
        document.add(new Paragraph(" ")); 

        
        // DATOS DE EMPRESA Y FACTURAR A
        
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .useAllAvailableWidth();

        
        Paragraph empresaTitle = new Paragraph("Emitido por:")
                .setBold()
                .setFontSize(10)
                .setFontColor(grisTexto);

        Paragraph empresaBody = new Paragraph(
                "Centro de Masajes Relax Total\n" +
                "Av. El Buen Mar 125\n" +
                "Azerbaiyán\n" +
                "RUC: 56879513478"
        )
                .setFontSize(9)
                .setFontColor(grisTexto);

        Cell empresaCell = new Cell()
                .add(empresaTitle)
                .add(empresaBody)
                .setBorder(Border.NO_BORDER)
                .setPaddingRight(10);

        
        Paragraph clienteTitle = new Paragraph("Facturar a:")
                .setBold()
                .setFontSize(10)
                .setFontColor(grisTexto);

        Paragraph clienteBody = new Paragraph(customerName)
                .setFontSize(9)
                .setFontColor(grisTexto);

        Paragraph fechaBody = new Paragraph(
                "Fecha emisión: " + LocalDate.now() + "\n" +
                "N° de pedido: " + orderNumber + "\n" +
                "Método de pago: " + paymentMethod
        )
                .setFontSize(9)
                .setFontColor(grisTexto);

        Cell clienteCell = new Cell()
                .add(clienteTitle)
                .add(clienteBody)
                .add(new Paragraph(" ")) 
                .add(fechaBody)
                .setBorder(Border.NO_BORDER)
                .setPaddingLeft(10);

        infoTable.addCell(empresaCell);
        infoTable.addCell(clienteCell);

        document.add(infoTable);
        document.add(new Paragraph(" ")); 

       
        //TABLA DE DETALLE (CANT / DESCRIPCION / PRECIO / IMPORTE)
        
        Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{10, 50, 20, 20}))
                .useAllAvailableWidth();

        // Encabezados de la tabla
        itemsTable.addHeaderCell(
                new Cell().add(new Paragraph("CANT.")
                                .setBold()
                                .setFontSize(9))
                        .setBackgroundColor(grisClaro)
                        .setTextAlignment(TextAlignment.CENTER)
        );
        itemsTable.addHeaderCell(
                new Cell().add(new Paragraph("DESCRIPCIÓN")
                                .setBold()
                                .setFontSize(9))
                        .setBackgroundColor(grisClaro)
                        .setTextAlignment(TextAlignment.LEFT)
        );
        itemsTable.addHeaderCell(
                new Cell().add(new Paragraph("PRECIO UNITARIO")
                                .setBold()
                                .setFontSize(9))
                        .setBackgroundColor(grisClaro)
                        .setTextAlignment(TextAlignment.RIGHT)
        );
        itemsTable.addHeaderCell(
                new Cell().add(new Paragraph("IMPORTE")
                                .setBold()
                                .setFontSize(9))
                        .setBackgroundColor(grisClaro)
                        .setTextAlignment(TextAlignment.RIGHT)
        );

        // Cálculo de precio unitario e importe
        int safeQuantity = Math.max(1, quantity);
        double unitPrice = total / safeQuantity;
        double lineTotal = unitPrice * safeQuantity;

        // Fila de datos
        itemsTable.addCell(
                new Cell().add(new Paragraph(String.valueOf(safeQuantity))
                                .setFontSize(9))
                        .setTextAlignment(TextAlignment.CENTER)
        );
        itemsTable.addCell(
                new Cell().add(new Paragraph(description)
                                .setFontSize(9))
                        .setTextAlignment(TextAlignment.LEFT)
        );
        itemsTable.addCell(
                new Cell().add(new Paragraph(String.format("S/ %.2f", unitPrice))
                                .setFontSize(9))
                        .setTextAlignment(TextAlignment.RIGHT)
        );
        itemsTable.addCell(
                new Cell().add(new Paragraph(String.format("S/ %.2f", lineTotal))
                                .setFontSize(9))
                        .setTextAlignment(TextAlignment.RIGHT)
        );

        document.add(itemsTable);

        
        //TABLA DE TOTALES (SUBTOTAL / IGV / TOTAL)
        
        document.add(new Paragraph(" "));

        // Cálculo de IGV 
        double subTotal = Math.round((total / 1.18) * 100.0) / 100.0;
        double igv = Math.round((total - subTotal) * 100.0) / 100.0;

        Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .useAllAvailableWidth();

        
        totalsTable.addCell(new Cell().setBorder(Border.NO_BORDER));
        Cell totalsRight = new Cell().setBorder(Border.NO_BORDER);

        totalsRight.add(new Paragraph(String.format("Subtotal:  S/ %.2f", subTotal))
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(9));
        totalsRight.add(new Paragraph(String.format("IGV (18%%): S/ %.2f", igv))
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontSize(9));
        totalsRight.add(new Paragraph(String.format("TOTAL:     S/ %.2f", total))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold()
                .setFontSize(11));

        totalsTable.addCell(totalsRight);
        document.add(totalsTable);

        document.add(new Paragraph(" ")); // espacio antes del QR

       
        //CÓDIGO QR 

        
        String qrText = "https://www.relaxtotal.com/factura/" + invoiceNumber;

        
        BarcodeQRCode qr = new BarcodeQRCode(qrText);

        Image qrImage = new Image(qr.createFormXObject(pdf))
                .setWidth(90)   // tamaño aprox del QR
                .setHeight(90)
                .setHorizontalAlignment(HorizontalAlignment.CENTER); // centrado

        document.add(qrImage);

        
        document.add(
                new Paragraph("N° ORDEN: " + orderNumber)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setFontSize(9)
        );

    
        //CONDICIONES DE PAGO
       
        Paragraph condicionesTitle = new Paragraph("Condiciones y forma de pago")
                .setBold()
                .setFontSize(9)
                .setFontColor(grisTexto);

        
        Paragraph condicionesBody1 = new Paragraph("El pago se realizará al finalizar el servicio.")
                .setFontSize(8)
                .setFontColor(grisTexto);

        Paragraph condicionesBody2 = new Paragraph("Para cualquier consulta comuníquese con: emuandrepc@gmail.com")
                .setFontSize(8)
                .setFontColor(grisTexto);

        
        Canvas footerCanvas = new Canvas(pdf.getFirstPage(), pdf.getDefaultPageSize());

        float footerX = document.getLeftMargin();
        // Coordenadas Y para cada línea del footer
        float footerYTitle = 80f;   
        float footerYBody1 = 66f;   
        float footerYBody2 = 52f;  

        footerCanvas.showTextAligned(condicionesTitle, footerX, footerYTitle, TextAlignment.LEFT);
        footerCanvas.showTextAligned(condicionesBody1, footerX, footerYBody1, TextAlignment.LEFT);
        footerCanvas.showTextAligned(condicionesBody2, footerX, footerYBody2, TextAlignment.LEFT);

        footerCanvas.close();

        // Cerramos el documento 
        document.close();
        return baos.toByteArray();

    } catch (Exception e) {
        throw new RuntimeException("Error generando FACTURA PDF: " + e.getMessage(), e);
    }
}


}
