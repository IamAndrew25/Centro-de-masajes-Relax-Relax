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
import com.andreutp.centromasajes.dto.InvoiceItem;
import java.util.List;

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

/**
 * FACTURA MULTI-ITEMS (varios servicios, cantidades y precios)
 * ESTE ES EL NUEVO MÉTODO
 */
public static byte[] generateInvoiceA4MultiItemsPdf(
        String customerName,
        String invoiceNumber,
        List<InvoiceItem> items,
        String paymentMethod,
        String orderNumber) {

    logger.info("Generando FACTURA PDF A4 MULTI-ITEMS para cliente {}", customerName);

    try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(40, 40, 40, 40);

        Color azulHeader = new DeviceRgb(0, 84, 147);
        Color grisClaro = new DeviceRgb(240, 240, 240);
        Color grisTexto = new DeviceRgb(60, 60, 60);
        Color blanco = new DeviceRgb(255, 255, 255);

        // ======= MARCA DE AGUA =======
        try {
            String logoPath = "C:\\Users\\riosb\\Downloads\\Centro-de-masajes-Relax-Relax(CLON)\\Front-End\\src\\assets\\images\\logo.png";
            ImageData logoData = ImageDataFactory.create(logoPath);
            Image watermark = new Image(logoData);
            watermark.scaleToFit(300, 300);
            float x = (PageSize.A4.getWidth() - 300) / 2;
            float y = (PageSize.A4.getHeight() - 300) / 2;
            watermark.setFixedPosition(x, y);
            watermark.setOpacity(0.08f);
            document.add(watermark);
        } catch (Exception e) {
            logger.warn("No se pudo cargar marca de agua");
        }

        // ======= CABECERA =======
        Table headerBand = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .useAllAvailableWidth();

        Paragraph brand = new Paragraph("Relax Total")
                .setBold().setFontSize(18).setFontColor(blanco);
        Paragraph subBrand = new Paragraph("Centro de Masajes Relax Total")
                .setFontSize(9).setFontColor(blanco);

        Cell brandCell = new Cell()
                .add(brand).add(subBrand)
                .setBackgroundColor(azulHeader)
                .setBorder(Border.NO_BORDER)
                .setPadding(10);

        Paragraph facturaLabel = new Paragraph("FACTURA")
                .setBold().setFontSize(14).setFontColor(blanco)
                .setTextAlignment(TextAlignment.RIGHT);
        Paragraph facturaNumber = new Paragraph("N° " + invoiceNumber)
                .setFontSize(11).setFontColor(blanco)
                .setTextAlignment(TextAlignment.RIGHT);

        Cell facturaCell = new Cell()
                .add(facturaLabel).add(facturaNumber)
                .setBackgroundColor(azulHeader)
                .setBorder(Border.NO_BORDER)
                .setPadding(10);

        headerBand.addCell(brandCell);
        headerBand.addCell(facturaCell);

        document.add(headerBand);
        document.add(new Paragraph(" "));

        // ======= INFO EMPRESA / CLIENTE =======
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
                .useAllAvailableWidth();

        Paragraph empresaTitle = new Paragraph("Emitido por:")
                .setBold().setFontSize(10).setFontColor(grisTexto);
        Paragraph empresaBody = new Paragraph(
                "Centro de Masajes Relax Total\n" +
                "Av. El buen masaje, Miraflores\n" +
                "RUC: 56879513478\n" +
                "Lima, Perú"
        ).setFontSize(9).setFontColor(grisTexto);

        Cell empresaCell = new Cell()
                .add(empresaTitle).add(empresaBody)
                .setBorder(Border.NO_BORDER);

        Paragraph clienteTitle = new Paragraph("Facturar a:")
                .setBold().setFontSize(10).setFontColor(grisTexto);
        Paragraph clienteBody = new Paragraph(customerName)
                .setFontSize(9).setFontColor(grisTexto);

        String pedidoLine = (orderNumber != null && !orderNumber.isBlank())
                ? "N° de pedido: " + orderNumber + "\n"
                : "";

        String metodoPagoSeguro = (paymentMethod == null || paymentMethod.isBlank())
                ? "Visa"
                : paymentMethod;

        Paragraph fechaBody = new Paragraph(
                "Fecha emisión: " + LocalDate.now() + "\n" +
                        pedidoLine +
                        "Método de pago: " + metodoPagoSeguro
        ).setFontSize(9).setFontColor(grisTexto);

        Cell clienteCell = new Cell()
                .add(clienteTitle).add(clienteBody)
                .add(new Paragraph(" "))
                .add(fechaBody)
                .setBorder(Border.NO_BORDER);

        infoTable.addCell(empresaCell);
        infoTable.addCell(clienteCell);

        document.add(infoTable);
        document.add(new Paragraph(" "));

        // ======= TABLA ITEMS MULTI =======
        Table itemsTable = new Table(UnitValue.createPercentArray(new float[]{10, 50, 20, 20}))
                .useAllAvailableWidth();

        itemsTable.addHeaderCell(new Cell().add(new Paragraph("CANT.").setBold().setFontSize(9))
                .setBackgroundColor(grisClaro).setTextAlignment(TextAlignment.CENTER));
        itemsTable.addHeaderCell(new Cell().add(new Paragraph("DESCRIPCIÓN").setBold().setFontSize(9))
                .setBackgroundColor(grisClaro));
        itemsTable.addHeaderCell(new Cell().add(new Paragraph("PRECIO UNIT.").setBold().setFontSize(9))
                .setBackgroundColor(grisClaro).setTextAlignment(TextAlignment.RIGHT));
        itemsTable.addHeaderCell(new Cell().add(new Paragraph("IMPORTE").setBold().setFontSize(9))
                .setBackgroundColor(grisClaro).setTextAlignment(TextAlignment.RIGHT));

        double totalFinal = 0.0;

        for (InvoiceItem item : items) {
            int qty = Math.max(1, item.getCantidad());
            double unit = item.getPrecioUnitario();
            double importe = qty * unit;
            totalFinal += importe;

            itemsTable.addCell(new Cell().add(new Paragraph(String.valueOf(qty))).setTextAlignment(TextAlignment.CENTER));
            itemsTable.addCell(new Cell().add(new Paragraph(item.getDescripcion())));
            itemsTable.addCell(new Cell().add(new Paragraph(String.format("S/ %.2f", unit))).setTextAlignment(TextAlignment.RIGHT));
            itemsTable.addCell(new Cell().add(new Paragraph(String.format("S/ %.2f", importe))).setTextAlignment(TextAlignment.RIGHT));
        }

        document.add(itemsTable);

        document.add(new Paragraph(" "));

        // ======= TOTALES =======
        double subtotal = totalFinal / 1.18;
        double igv = totalFinal - subtotal;

        Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                .useAllAvailableWidth();

        Cell right = new Cell().setBorder(Border.NO_BORDER);

        right.add(new Paragraph(String.format("Subtotal: S/ %.2f", subtotal))
                .setFontSize(9).setTextAlignment(TextAlignment.RIGHT));
        right.add(new Paragraph(String.format("IGV (18%%): S/ %.2f", igv))
                .setFontSize(9).setTextAlignment(TextAlignment.RIGHT));
        right.add(new Paragraph(String.format("TOTAL: S/ %.2f", totalFinal))
                .setBold().setFontSize(11).setTextAlignment(TextAlignment.RIGHT));

        totalsTable.addCell(new Cell().setBorder(Border.NO_BORDER));
        totalsTable.addCell(right);

        document.add(totalsTable);

        document.add(new Paragraph(" "));

        // ======= QR =======
        String qrText = "https://www.relaxtotal.com/factura/" + invoiceNumber;

        BarcodeQRCode qr = new BarcodeQRCode(qrText);
        Image qrImage = new Image(qr.createFormXObject(pdf))
                .setWidth(90).setHeight(90)
                .setHorizontalAlignment(HorizontalAlignment.CENTER);
        document.add(qrImage);

        document.add(new Paragraph("N° ORDEN: " + orderNumber)
                .setFontSize(9).setTextAlignment(TextAlignment.CENTER));


        // FOOTER: Condiciones de pago y contacto
        Paragraph condicionesTitle = new Paragraph("Condiciones y forma de pago")
                .setBold()
                .setFontSize(9)
                .setFontColor(new DeviceRgb(60, 60, 60));

        Paragraph condicionesBody1 = new Paragraph("El pago se realizará al finalizar el servicio.")
                .setFontSize(8)
                .setFontColor(new DeviceRgb(60, 60, 60));

        Paragraph condicionesBody2 = new Paragraph("Para cualquier consulta comuníquese con: contacto@relaxtotal.com")
                .setFontSize(8)
                .setFontColor(new DeviceRgb(60, 60, 60));

        // Crear un Canvas para colocar en el pie de página
        Canvas footerCanvas = new Canvas(pdf.getFirstPage(), pdf.getDefaultPageSize());

        // Posición X del pie (alineado a la izquierda)
        float footerX = document.getLeftMargin();
        // Posición Y (a medida que vayas ajustando el Y, se mueve más abajo o más arriba)
        float footerYTitle = 80f;   // Título
        float footerYBody1 = 66f;   // Primera línea de condiciones
        float footerYBody2 = 52f;   // Segunda línea de condiciones

        // Mostrar el texto en el footer
        footerCanvas.showTextAligned(condicionesTitle, footerX, footerYTitle, TextAlignment.LEFT);
        footerCanvas.showTextAligned(condicionesBody1, footerX, footerYBody1, TextAlignment.LEFT);
        footerCanvas.showTextAligned(condicionesBody2, footerX, footerYBody2, TextAlignment.LEFT);

        // Cerrar el canvas para que se dibuje en el PDF
        footerCanvas.close();

        document.close();
        return baos.toByteArray();

    } catch (Exception e) {
        throw new RuntimeException("Error generando factura MULTI-ITEMS: " + e.getMessage(), e);
    }

}
/**
 * FACTURA A4 ORIGINAL (1 ITEM)
 * Ahora usa el método MULTI-ITEMS internamente
 */
public static byte[] generateInvoiceA4Pdf(String customerName,
                                          String invoiceNumber,
                                          String description,
                                          int quantity,
                                          double total,
                                          String paymentMethod,
                                          String orderNumber) {

    int qty = Math.max(1, quantity);
    double unitPrice = total / qty;

    List<InvoiceItem> items = List.of(
            new InvoiceItem(description, qty, unitPrice)
    );

    return generateInvoiceA4MultiItemsPdf(
            customerName,
            invoiceNumber,
            items,
            paymentMethod,
            orderNumber
    );
}

        


}
