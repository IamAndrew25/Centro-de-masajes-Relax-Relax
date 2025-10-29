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


    // Clientes
    // --- Clientes ---
    public static byte[] generarReporteClientes(List<UserModel> clientes, IAppointmentRepository appointmentRepository) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Clientes");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Nombre");
            header.createCell(2).setCellValue("Email");
            header.createCell(3).setCellValue("Teléfono");
            header.createCell(4).setCellValue("Última Visita");
            header.createCell(5).setCellValue("Servicios");
            header.createCell(6).setCellValue("Tipo Masaje");

            int i = 1;
            for (UserModel c : clientes) {
                Row row = sheet.createRow(i++);
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
            }

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
            Sheet sheet = workbook.createSheet("Trabajadores");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Nombre");
            header.createCell(2).setCellValue("Email");
            header.createCell(3).setCellValue("Teléfono");
            header.createCell(4).setCellValue("DNI");
            header.createCell(5).setCellValue("Especialidad");
            header.createCell(6).setCellValue("Estado");
            header.createCell(7).setCellValue("Experiencia");

            int i = 1;
            for (UserModel w : trabajadores) {
                Row row = sheet.createRow(i++);
                row.createCell(0).setCellValue(w.getId());
                row.createCell(1).setCellValue(w.getUsername());
                row.createCell(2).setCellValue(w.getEmail());
                row.createCell(3).setCellValue(w.getPhone());
                row.createCell(4).setCellValue(w.getDni());
                row.createCell(5).setCellValue(w.getEspecialidad());
                row.createCell(6).setCellValue(w.getEstado());
                row.createCell(7).setCellValue(w.getExperiencia() != null ? w.getExperiencia() : 0);
            }

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
            Sheet sheet = workbook.createSheet("Servicios");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Nombre");
            header.createCell(2).setCellValue("Precio");
            header.createCell(3).setCellValue("Duración");

            int i = 1;
            for (ServiceModel s : servicios) {
                Row row = sheet.createRow(i++);
                row.createCell(0).setCellValue(s.getId());
                row.createCell(1).setCellValue(s.getName());
                row.createCell(2).setCellValue(s.getBaseprice());
                row.createCell(3).setCellValue(s.getDurationMin());
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
            Sheet sheet = workbook.createSheet("Reservas");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Cliente");
            header.createCell(2).setCellValue("Trabajador");
            header.createCell(3).setCellValue("Servicio");
            header.createCell(4).setCellValue("Fecha y Hora");
            header.createCell(5).setCellValue("Estado");

            int i = 1;
            for (AppointmentModel a : reservas) {
                Row row = sheet.createRow(i++);
                row.createCell(0).setCellValue(a.getId());
                row.createCell(1).setCellValue(a.getUser().getUsername());
                row.createCell(2).setCellValue(a.getWorker().getUsername());
                row.createCell(3).setCellValue(a.getService().getName());
                row.createCell(4).setCellValue(a.getAppointmentStart().toString());
                row.createCell(5).setCellValue(a.getStatus().toString());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generando Excel de reservas", e);
        }
    }

}
