package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.model.UserModel;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private IServiceRepository serviceRepository;

    @Autowired
    private IUserRepository userRepository;

    /**
     * Genera un reporte mensual completo en Excel
     */
    public void generarReporteMensual(HttpServletResponse response) throws IOException {
        // Crear el libro de Excel
        Workbook workbook = new XSSFWorkbook();

        // Crear las diferentes hojas
        crearHojaResumenGeneral(workbook);
        crearHojaServicios(workbook);
        crearHojaUsuarios(workbook);
        crearHojaEstadisticas(workbook);

        // ===== CONFIGURAR RESPUESTA HTTP =====
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=reporte_mensual_" + fecha + ".xlsx");

        // Escribir el archivo al response
        workbook.write(response.getOutputStream());
        workbook.close();
    }

    /**
     * HOJA 1: Resumen General
     */
    private void crearHojaResumenGeneral(Workbook workbook) {
        Sheet sheet = workbook.createSheet("📊 Resumen General");

        // Obtener datos
        long totalUsuarios = userRepository.count();
        long totalServicios = serviceRepository.count();
        long serviciosActivos = serviceRepository.findAll().stream().filter(ServiceModel::getActive).count();
        double ingresoEstimado = serviceRepository.findAll().stream()
                .filter(ServiceModel::getActive)
                .mapToDouble(ServiceModel::getBaseprice)
                .sum();

        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle labelStyle = createLabelStyle(workbook);
        CellStyle valueStyle = createValueStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("📈 REPORTE MENSUAL - CENTRO DE MASAJES RELAX RELAX");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

        // Fecha de generación
        rowNum++;
        Row dateRow = sheet.createRow(rowNum++);
        Cell dateCell = dateRow.createCell(0);
        dateCell.setCellValue("Fecha de Generación: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

        rowNum++;

        // Métricas principales
        String[] labels = {
            "👥 Total de Usuarios Registrados:",
            "💆 Total de Servicios Ofrecidos:",
            "✅ Servicios Activos:",
            "❌ Servicios Inactivos:",
            "💰 Catálogo de Precios (Suma Total):"
        };

        Object[] values = {
            totalUsuarios,
            totalServicios,
            serviciosActivos,
            totalServicios - serviciosActivos,
            ingresoEstimado
        };

        for (int i = 0; i < labels.length; i++) {
            Row row = sheet.createRow(rowNum++);
            
            Cell labelCell = row.createCell(0);
            labelCell.setCellValue(labels[i]);
            labelCell.setCellStyle(labelStyle);
            sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

            Cell valueCell = row.createCell(2);
            if (i == 4) { // Para el ingreso usar formato de moneda
                valueCell.setCellValue((Double) values[i]);
                valueCell.setCellStyle(currencyStyle);
            } else {
                valueCell.setCellValue(values[i].toString());
                valueCell.setCellStyle(valueStyle);
            }
        }

        // Auto-ajustar columnas
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 2000);
        }
    }

    /**
     * HOJA 2: Detalle de Servicios
     */
    private void crearHojaServicios(Workbook workbook) {
        Sheet sheet = workbook.createSheet("💆 Servicios");
        List<ServiceModel> servicios = serviceRepository.findAll();

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("💆 CATÁLOGO DE SERVICIOS COMPLETO");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 4));

        rowNum++;

        // Encabezados
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"ID", "Servicio", "Duración (min)", "Precio (S/)", "Estado"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Datos
        for (ServiceModel servicio : servicios) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(servicio.getId());
            row.createCell(1).setCellValue(servicio.getName());
            row.createCell(2).setCellValue(servicio.getDurationMin());
            
            Cell priceCell = row.createCell(3);
            priceCell.setCellValue(servicio.getBaseprice());
            priceCell.setCellStyle(currencyStyle);
            
            row.createCell(4).setCellValue(servicio.getActive() ? "✅ Activo" : "❌ Inactivo");

            for (int i = 0; i < 5; i++) {
                if (i != 3) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
        }

        // Auto-ajustar columnas
        for (int i = 0; i < 5; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
        }
    }

    /**
     * HOJA 3: Usuarios Registrados
     */
    private void crearHojaUsuarios(Workbook workbook) {
        Sheet sheet = workbook.createSheet("👥 Usuarios");
        List<UserModel> usuarios = userRepository.findAll();

        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("👥 USUARIOS REGISTRADOS EN EL SISTEMA");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

        rowNum++;

        // Encabezados
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"ID", "Usuario", "Email", "Teléfono", "DNI", "Rol"};
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Datos
        for (UserModel usuario : usuarios) {
            Row row = sheet.createRow(rowNum++);
            
            row.createCell(0).setCellValue(usuario.getId());
            row.createCell(1).setCellValue(usuario.getUsername());
            row.createCell(2).setCellValue(usuario.getEmail());
            row.createCell(3).setCellValue(usuario.getPhone());
            row.createCell(4).setCellValue(usuario.getDni());
            row.createCell(5).setCellValue(usuario.getRole() != null ? usuario.getRole().getName() : "Sin rol");

            for (int i = 0; i < 6; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }

        // Auto-ajustar columnas
        for (int i = 0; i < 6; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
        }
    }

    /**
     * HOJA 4: Estadísticas Avanzadas
     */
    private void crearHojaEstadisticas(Workbook workbook) {
        Sheet sheet = workbook.createSheet("📊 Estadísticas");
        List<ServiceModel> servicios = serviceRepository.findAll();

        CellStyle currencyStyle = createCurrencyStyle(workbook);

        int rowNum = 0;

        // Título
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("📊 ANÁLISIS ESTADÍSTICO DE SERVICIOS");
        titleCell.setCellStyle(createTitleStyle(workbook));
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

        rowNum += 2;

        // Estadísticas de precios
        DoubleSummaryStatistics stats = servicios.stream()
                .filter(ServiceModel::getActive)
                .mapToDouble(ServiceModel::getBaseprice)
                .summaryStatistics();

        String[] statsLabels = {
            "💰 Precio Promedio:",
            "💎 Precio Máximo:",
            "💵 Precio Mínimo:",
            "🔢 Cantidad de Servicios Analizados:"
        };

        Object[] statsValues = {
            stats.getAverage(),
            stats.getMax(),
            stats.getMin(),
            stats.getCount()
        };

        for (int i = 0; i < statsLabels.length; i++) {
            Row row = sheet.createRow(rowNum++);
            
            Cell labelCell = row.createCell(0);
            labelCell.setCellValue(statsLabels[i]);
            labelCell.setCellStyle(createLabelStyle(workbook));
            sheet.addMergedRegion(new CellRangeAddress(rowNum - 1, rowNum - 1, 0, 1));

            Cell valueCell = row.createCell(2);
            if (i < 3) {
                valueCell.setCellValue((Double) statsValues[i]);
                valueCell.setCellStyle(currencyStyle);
            } else {
                valueCell.setCellValue(statsValues[i].toString());
                valueCell.setCellStyle(createValueStyle(workbook));
            }
        }

        // Auto-ajustar columnas
        for (int i = 0; i < 4; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 2000);
        }
    }

    // ===== MÉTODOS PARA CREAR ESTILOS =====

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        
        return style;
    }

    private CellStyle createCurrencyStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("S/ #,##0.00"));
        
        style.setAlignment(HorizontalAlignment.RIGHT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        
        return style;
    }

    private CellStyle createLabelStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createValueStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.DARK_GREEN.getIndex());
        font.setBold(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
}
