package com.andreutp.centromasajes.utils;

import com.andreutp.centromasajes.model.PaymentModel;


import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ExcelReportGeneratorTest {
  /*  @Mock
    private IAppointmentRepository appointmentRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerarReportePagos() {
        PaymentModel pago = new PaymentModel();
        pago.setId(1L);
        UserModel user = new UserModel();
        user.setUsername("Juan");
        pago.setUser(user);
        pago.setAmount(100.0);
        pago.setMethod(PaymentModel.Status.PAID.name());
        pago.setCreatedAt(LocalDateTime.now());

        List<PaymentModel> pagos = List.of(pago);

        byte[] excelBytes = ExcelReportGenerator.generarReportePagos(pagos);

        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);
    }

    @Test
    void testGenerarReporteClientes() {
        UserModel cliente = new UserModel();
        cliente.setId(1L);
        cliente.setUsername("Juan");
        cliente.setEmail("juan@test.com");
        cliente.setPhone("123456");

        AppointmentModel cita = new AppointmentModel();
        cita.setAppointmentStart(LocalDateTime.now());
        ServiceModel servicio = new ServiceModel();
        servicio.setName("Masaje");
        cita.setService(servicio);

        when(appointmentRepository.findByUserIdOrderByAppointmentStartDesc(1L))
                .thenReturn(List.of(cita));

        byte[] excelBytes = ExcelReportGenerator.generarReporteClientes(
                List.of(cliente), appointmentRepository);

        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);
    }

    @Test
    void testGenerarReporteTrabajadores() {
        UserModel trabajador = new UserModel();
        trabajador.setId(1L);
        trabajador.setUsername("Pedro");
        trabajador.setEmail("pedro@test.com");
        trabajador.setPhone("654321");
        trabajador.setDni("12345678");
        trabajador.setEspecialidad("Masajista");
        trabajador.setEstado("Activo");
        trabajador.setExperiencia(5);

        byte[] excelBytes = ExcelReportGenerator.generarReporteTrabajadores(
                List.of(trabajador));

        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);
    }

    @Test
    void testGenerarReporteServicios() {
        ServiceModel servicio = new ServiceModel();
        servicio.setId(1L);
        servicio.setName("Masaje");
        servicio.setBaseprice(100.0);
        servicio.setDurationMin(60);

        byte[] excelBytes = ExcelReportGenerator.generarReporteServicios(
                List.of(servicio));

        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);
    }

    @Test
    void testGenerarReporteReservas() {
        AppointmentModel reserva = new AppointmentModel();
        reserva.setId(1L);
        UserModel cliente = new UserModel();
        cliente.setUsername("Juan");
        reserva.setUser(cliente);
        UserModel trabajador = new UserModel();
        trabajador.setUsername("Pedro");
        reserva.setWorker(trabajador);
        ServiceModel servicio = new ServiceModel();
        servicio.setName("Masaje");
        reserva.setService(servicio);
        reserva.setAppointmentStart(LocalDateTime.now());
        reserva.setStatus(AppointmentModel.Status.CONFIRMED);

        byte[] excelBytes = ExcelReportGenerator.generarReporteReservas(
                List.of(reserva));

        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);
    }*/
}
