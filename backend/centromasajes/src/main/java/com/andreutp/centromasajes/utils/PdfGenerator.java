package com.andreutp.centromasajes.utils;


import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;

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

            document.add(new Paragraph("\nGracias por su preferencia ❤️"));

            document.close();
            logger.info("PDF generado correctamente para la boleta {}", invoiceNumber);
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF: " + e.getMessage(), e);
        }
    }
}
