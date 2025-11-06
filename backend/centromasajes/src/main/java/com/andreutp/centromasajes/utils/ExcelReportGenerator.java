package com.andreutp.centromasajes.utils;

import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.model.UserModel;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class ExcelReportGenerator {

    @Autowired
    private IAppointmentRepository appointmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(ExcelReportGenerator.class);
    //APACHE POI PARA EXCEL PORQUE NO DA PDF DIRECTAMENTE xd

    public static byte[] generarReportePagos(List<PaymentModel> pagos) {
        logger.info("Generando Excel para {} pagos", pagos.size());

        try (Workbook workbook = new XSSFWorkbook()) {
            ExcelStyles styles = createStyles(workbook);
            Sheet sheet = workbook.createSheet("Pagos");

            // ENCABEZADOS
            Row header = sheet.createRow(0);
            String[] columnas = {"ID", "Cliente", "Monto", "Método", "Fecha"};
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(styles.headerStyle);
            }

            // FILAS
            int rowNum = 1;
            for (PaymentModel p : pagos) {
                Row row = sheet.createRow(rowNum);
                CellStyle rowStyle = (rowNum % 2 == 0) ? styles.normalStyle : styles.alternateStyle;

                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getUser().getUsername());
                row.createCell(2).setCellValue(p.getAmount().doubleValue());
                row.createCell(3).setCellValue(p.getMethod().toString());
                row.createCell(4).setCellValue(p.getCreatedAt() != null ? p.getCreatedAt().toString() : "");

                for (int i = 0; i < columnas.length; i++) {
                    row.getCell(i).setCellStyle(rowStyle);
                }

                rowNum++;
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
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


    // --- Clientes ---
    public static byte[] generarReporteClientes(List<UserModel> clientes, IAppointmentRepository appointmentRepository) {
        try (Workbook workbook = new XSSFWorkbook()) {
            ExcelStyles styles = createStyles(workbook);
            Sheet sheet = workbook.createSheet("Clientes");

            String[] columnas = {"ID", "Nombre", "Email", "Teléfono", "Última Visita", "Servicios", "Tipo Masaje"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(columnas[i]);
                c.setCellStyle(styles.headerStyle);
            }

            int rowNum = 1;
            for (UserModel c : clientes) {
                Row row = sheet.createRow(rowNum);
                CellStyle rowStyle = (rowNum % 2 == 0) ? styles.normalStyle : styles.alternateStyle;

                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getUsername());
                row.createCell(2).setCellValue(c.getEmail());
                row.createCell(3).setCellValue(c.getPhone());

                List<AppointmentModel> citas = appointmentRepository.findByUserIdOrderByAppointmentStartDesc(c.getId());
                if (!citas.isEmpty()) {
                    AppointmentModel last = citas.get(0);
                    row.createCell(4).setCellValue(last.getAppointmentStart().toString());
                    row.createCell(5).setCellValue(citas.size());
                    row.createCell(6).setCellValue(last.getService().getName());
                } else {
                    row.createCell(4).setCellValue("-");
                    row.createCell(5).setCellValue(0);
                    row.createCell(6).setCellValue("-");
                }

                for (int i = 0; i < columnas.length; i++) {
                    row.getCell(i).setCellStyle(rowStyle);
                }
                rowNum++;
            }

            for (int i = 0; i < columnas.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel de clientes", e);
        }
    }



    // Trabajadores
    public static byte[] generarReporteTrabajadores(List<UserModel> trabajadores) {
        try (Workbook workbook = new XSSFWorkbook()) {
            ExcelStyles styles = createStyles(workbook);
            Sheet sheet = workbook.createSheet("Trabajadores");

            String[] columnas = {"ID", "Nombre", "Email", "Teléfono", "DNI", "Especialidad", "Estado", "Experiencia"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(columnas[i]);
                c.setCellStyle(styles.headerStyle);
            }

            int rowNum = 1;
            for (UserModel w : trabajadores) {
                Row row = sheet.createRow(rowNum);
                CellStyle rowStyle = (rowNum % 2 == 0) ? styles.normalStyle : styles.alternateStyle;

                row.createCell(0).setCellValue(w.getId());
                row.createCell(1).setCellValue(w.getUsername());
                row.createCell(2).setCellValue(w.getEmail());
                row.createCell(3).setCellValue(w.getPhone());
                row.createCell(4).setCellValue(w.getDni());
                row.createCell(5).setCellValue(w.getEspecialidad());
                row.createCell(6).setCellValue(w.getEstado());
                row.createCell(7).setCellValue(w.getExperiencia() != null ? w.getExperiencia() : 0);

                for (int i = 0; i < columnas.length; i++) {
                    row.getCell(i).setCellStyle(rowStyle);
                }
                rowNum++;
            }

            for (int i = 0; i < columnas.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel de trabajadores", e);
        }
    }

    // Servicios
    public static byte[] generarReporteServicios(List<ServiceModel> servicios) {
        try (Workbook workbook = new XSSFWorkbook()) {
            ExcelStyles styles = createStyles(workbook);
            Sheet sheet = workbook.createSheet("Servicios");

            String[] columnas = {"ID", "Nombre", "Precio", "Duración"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(columnas[i]);
                c.setCellStyle(styles.headerStyle);
            }

            int rowNum = 1;
            for (ServiceModel s : servicios) {
                Row row = sheet.createRow(rowNum);
                CellStyle rowStyle = (rowNum % 2 == 0) ? styles.normalStyle : styles.alternateStyle;

                row.createCell(0).setCellValue(s.getId());
                row.createCell(1).setCellValue(s.getName());
                row.createCell(2).setCellValue(s.getBaseprice());
                row.createCell(3).setCellValue(s.getDurationMin());

                for (int i = 0; i < columnas.length; i++) {
                    row.getCell(i).setCellStyle(rowStyle);
                }

                rowNum++;
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel de servicios", e);
        }
    }

    // Reservas
    public static byte[] generarReporteReservas(List<AppointmentModel> reservas) {
        try (Workbook workbook = new XSSFWorkbook()) {
            ExcelStyles styles = createStyles(workbook);
            Sheet sheet = workbook.createSheet("Reservas");

            String[] columnas = {"ID", "Cliente", "Trabajador", "Servicio", "Fecha y Hora", "Estado"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(columnas[i]);
                c.setCellStyle(styles.headerStyle);
            }

            int rowNum = 1;
            for (AppointmentModel a : reservas) {
                Row row = sheet.createRow(rowNum);
                CellStyle rowStyle = (rowNum % 2 == 0) ? styles.normalStyle : styles.alternateStyle;

                row.createCell(0).setCellValue(a.getId());
                row.createCell(1).setCellValue(a.getUser().getUsername());
                row.createCell(2).setCellValue(a.getWorker().getUsername());
                row.createCell(3).setCellValue(a.getService().getName());
                row.createCell(4).setCellValue(a.getAppointmentStart().toString());
                row.createCell(5).setCellValue(a.getStatus().toString());

                for (int i = 0; i < columnas.length; i++) {
                    row.getCell(i).setCellStyle(rowStyle);
                }
                rowNum++;
            }

            for (int i = 0; i < columnas.length; i++) sheet.autoSizeColumn(i);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel de reservas", e);
        }
    }

    private static class ExcelStyles {
        CellStyle headerStyle;
        CellStyle normalStyle;
        CellStyle alternateStyle;
    }

    private static ExcelStyles createStyles(Workbook workbook) {
        ExcelStyles styles = new ExcelStyles();

        // Fuente para encabezado
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        // Estilo encabezado
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        // Estilo normal
        CellStyle normalStyle = workbook.createCellStyle();
        normalStyle.setBorderBottom(BorderStyle.THIN);
        normalStyle.setBorderTop(BorderStyle.THIN);
        normalStyle.setBorderLeft(BorderStyle.THIN);
        normalStyle.setBorderRight(BorderStyle.THIN);

        // Estilo alterno (para filas pares)
        CellStyle alternateStyle = workbook.createCellStyle();
        alternateStyle.cloneStyleFrom(normalStyle);
        alternateStyle.setFillForegroundColor(IndexedColors.LIGHT_TURQUOISE.getIndex());
        alternateStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        styles.headerStyle = headerStyle;
        styles.normalStyle = normalStyle;
        styles.alternateStyle = alternateStyle;
        return styles;
    }



}
