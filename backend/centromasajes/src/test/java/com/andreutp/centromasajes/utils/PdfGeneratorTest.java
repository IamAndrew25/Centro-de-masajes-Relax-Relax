package com.andreutp.centromasajes.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PdfGeneratorTest {
    @Test
    void testGenerateInvoicePdf() {
        byte[] pdfBytes = PdfGenerator.generateInvoicePdf("Juan", "001", 150.0);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }
}
