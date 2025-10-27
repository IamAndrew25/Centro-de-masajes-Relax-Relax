package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.utils.EmailService;
import com.andreutp.centromasajes.utils.ExcelReportGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class ReportService {
    //REPORTES O SEA MANDAR AL CORREO LOS REPORTES HARE 1 nomas
    @Autowired
    private EmailService emailService;

    @Autowired
    private IPaymentRepository ipaymentRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    public void enviarReportePagosUsuario(Long userId, String correo) {
        logger.info("Preparando reporte de pagos para usuario {}", userId);
        // 1 Obtener los pagos del usuario
        List<PaymentModel> pagos = ipaymentRepository.findAllByUserId(userId);

        if (pagos.isEmpty()) {
            throw new RuntimeException("No hay pagos registrados para este usuario.");
        }

        // 2 Generar Excel
        byte[] excelBytes = ExcelReportGenerator.generarReportePagos(pagos);
        logger.info("Enviando Excel por correo a {}", correo);

        // 3 Enviar por correo
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Pagos",
                "Adjuntamos su reporte de pagos en Excel.",
                excelBytes,
                "ReportePagos.xlsx"
        );
    }
}
