package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.utils.EmailService;
import com.andreutp.centromasajes.utils.ExcelReportGenerator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
public class TestEmailController {

    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/test-email")
    public String testEmail() {
        try {
            emailService.enviarBoletaConPDF(
                    "a2tsx1@gmail.com",          // tu correo de prueba
                    "Boleta de prueba",
                    "André Usuario",              // nombre del cliente
                    "0001",                       // número de boleta
                    120.50                        // total
            );
            return "Correo enviado correctamente!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error enviando correo: " + e.getMessage();
        }
    }

    @GetMapping("/test-excel")
    public String testExcel() {
        try {
            PaymentModel pago1 = new PaymentModel();
            pago1.setId(1L);
            pago1.setAmount(100.0);
            pago1.setMethod("Tarjeta");
            pago1.setCreatedAt(LocalDateTime.now());
            // Si tu PaymentModel tiene relación con UserModel:
            UserModel user1 = new UserModel();
            user1.setUsername("André");
            pago1.setUser(user1);

            PaymentModel pago2 = new PaymentModel();
            pago2.setId(2L);
            pago2.setAmount(150.0);
            pago2.setMethod("Efectivo");
            pago2.setCreatedAt(LocalDateTime.now());
            UserModel user2 = new UserModel();
            user2.setUsername("Juan");
            pago2.setUser(user2);

            List<PaymentModel> pagos = List.of(pago1, pago2);

            byte[] excelBytes = ExcelReportGenerator.generarReportePagos(pagos);

            emailService.enviarCorreoConAdjunto(
                    "a2tsx1@gmail.com",
                    "Reporte de pagos",
                    "Adjunto encontrarás tu reporte de pagos.",
                    excelBytes,
                    "reporte_pagos.xlsx"
            );

            return "Correo con Excel enviado!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error enviando Excel: " + e.getMessage();
        }
    }


}
