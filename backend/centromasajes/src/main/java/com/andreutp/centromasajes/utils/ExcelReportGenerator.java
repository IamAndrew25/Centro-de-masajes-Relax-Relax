package com.andreutp.centromasajes.utils;

import com.andreutp.centromasajes.model.PaymentModel;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class ExcelReportGenerator {

    private static final Logger logger = LoggerFactory.getLogger(ExcelReportGenerator.class);
    //APACHE POI PARA EXCEL PORQUE NO DA PDF DIRECTAMENTE xd
    public static byte[] generarReportePagos(List<PaymentModel> pagos) {
        logger.info("Generando Excel para {} pagos", pagos.size());

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Pagos");

            // Encabezado
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Cliente");
            header.createCell(2).setCellValue("Monto");
            header.createCell(3).setCellValue("Método");
            header.createCell(4).setCellValue("Fecha");

            int rowNum = 1;
            for (PaymentModel p : pagos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getUser().getUsername());
                row.createCell(2).setCellValue(p.getAmount().doubleValue());
                row.createCell(3).setCellValue(p.getMethod().toString());
                row.createCell(4).setCellValue(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");
            }

            // Guardar a bytes
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            // OPCIONAL: guardar copia física con Commons IO TAMBIEN PARA PRUEBAS O DEBUG fino
           /* File tempFile = new File("ReportePagos.xlsx");
            FileUtils.writeByteArrayToFile(tempFile, out.toByteArray());
            logger.info("Archivo Excel temporal guardado en {}", tempFile.getAbsolutePath());
*/
            return out.toByteArray();

        } catch (Exception e) {
            logger.error("Error generando Excel", e);
            throw new RuntimeException("Error generando Excel: " + e.getMessage(), e);
        }
    }
}
