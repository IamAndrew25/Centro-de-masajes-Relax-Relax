package com.andreutp.centromasajes.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.internet.MimeMessage;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EmailServiceTest {
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Mock
    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
       // when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void testEnviarCorreoSimple() {
        emailService.enviarCorreoSimple("cliente@test.com", "Asunto", "Mensaje");

        //verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testEnviarBoletaConPDF() {
        // Probamos que no lanza excepción
        assertDoesNotThrow(() -> emailService.enviarBoletaConPDF("cliente@test.com",
                "Boleta", "Juan", "001", 150.0));

        //verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testEnviarCorreoConAdjunto() {
        byte[] archivo = "contenido".getBytes();

        assertDoesNotThrow(() -> emailService.enviarCorreoConAdjunto(
                "cliente@test.com", "Asunto", "Mensaje", archivo, "archivo.txt"));

        //verify(mailSender, times(1)).send(mimeMessage);
    }
}
