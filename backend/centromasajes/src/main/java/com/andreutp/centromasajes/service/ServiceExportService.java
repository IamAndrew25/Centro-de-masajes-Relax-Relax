package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.model.ServiceModel;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ServiceExportService {

    @Autowired
    private IServiceRepository serviceRepository;

    /**
     * Exporta todos los servicios a un archivo Excel
     */
    public void exportToExcel(HttpServletResponse response) throws IOException {
        // Obtener todos los servicios de la base de datos
        List<ServiceModel> services = serviceRepository.findAll();

        // Crear el libro de Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Servicios de Masajes");

        // Crear estilos
        CellStyle headerStyle = createHeaderStyle(workbook);
        CellStyle dataStyle = createDataStyle(workbook);
        CellStyle currencyStyle = createCurrencyStyle(workbook);
        CellStyle titleStyle = createTitleStyle(workbook);
        CellStyle activeStyle = createActiveStyle(workbook);
        CellStyle inactiveStyle = createInactiveStyle(workbook);

        int rowNum = 0;

        // ===== TÍTULO PRINCIPAL =====
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("📋 CATÁLOGO DE SERVICIOS - CENTRO DE MASAJES RELAX RELAX");
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 5));

        // Fila vacía
        rowNum++;

        // ===== ENCABEZADOS =====
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"ID", "Nombre del Servicio", "Descripción", "Duración (min)", "Precio (S/)", "Estado"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // ===== DATOS DE SERVICIOS =====
        for (ServiceModel service : services) {
            Row row = sheet.createRow(rowNum++);

            // ID
            Cell cell0 = row.createCell(0);
            cell0.setCellValue(service.getId());
            cell0.setCellStyle(dataStyle);

            // Nombre
            Cell cell1 = row.createCell(1);
            cell1.setCellValue(service.getName());
            cell1.setCellStyle(dataStyle);

            // Descripción
            Cell cell2 = row.createCell(2);
            cell2.setCellValue(service.getDescription());
            cell2.setCellStyle(dataStyle);

            // Duración
            Cell cell3 = row.createCell(3);
            cell3.setCellValue(service.getDurationMin());
            cell3.setCellStyle(dataStyle);

            // Precio
            Cell cell4 = row.createCell(4);
            cell4.setCellValue(service.getBaseprice());
            cell4.setCellStyle(currencyStyle);

            // Estado
            Cell cell5 = row.createCell(5);
            if (service.getActive()) {
                cell5.setCellValue("✅ ACTIVO");
                cell5.setCellStyle(activeStyle);
            } else {
                cell5.setCellValue("❌ INACTIVO");
                cell5.setCellStyle(inactiveStyle);
            }
        }

        // ===== FILA DE TOTALES =====
        rowNum++; // Fila vacía
        Row totalRow = sheet.createRow(rowNum++);
        
        Cell totalLabelCell = totalRow.createCell(3);
        totalLabelCell.setCellValue("TOTAL SERVICIOS:");
        totalLabelCell.setCellStyle(headerStyle);

        Cell totalValueCell = totalRow.createCell(4);
        totalValueCell.setCellValue(services.size());
        totalValueCell.setCellStyle(headerStyle);

        // Auto-ajustar el ancho de las columnas
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000); // Agregar espacio extra
        }

        // Aplicar filtros automáticos
        sheet.setAutoFilter(new CellRangeAddress(2, rowNum - 3, 0, headers.length - 1));

        // ===== CONFIGURAR RESPUESTA HTTP =====
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=servicios_masajes.xlsx");

        // Escribir el archivo al response
        workbook.write(response.getOutputStream());
        workbook.close();
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
        font.setFontHeightInPoints((short) 12);
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
        
        style.setWrapText(true); // Ajustar texto
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

    private CellStyle createActiveStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.GREEN.getIndex());
        style.setFont(font);
        
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        
        return style;
    }

    private CellStyle createInactiveStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.RED.getIndex());
        style.setFont(font);
        
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        
        return style;
    }
}
