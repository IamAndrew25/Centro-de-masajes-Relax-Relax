package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IPaymentRepository;
import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.PaymentModel;
import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.model.UserModel;
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
    @Autowired
    private IServiceRepository serviceRepository;

    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IAppointmentRepository appointmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    //Reporte de Pagos
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

    // Reporte de Clientes cCon correo
    public void enviarReporteClientes(String correo) {
        // Filtrar usuarios que son clientes
        List<UserModel> clientes = userRepository.findByRoleName("USER");

        // Generar Excel
        byte[] excel = ExcelReportGenerator.generarReporteClientes(clientes, appointmentRepository);

        // Enviar correo
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Clientes",
                "Adjunto encontrarás el reporte de clientes en formato Excel.",
                excel,
                "ReporteClientes.xlsx"
        );
    }
    // DESCARGAR PC
    public byte[] generarExcelClientes() {
        List<UserModel> clientes = userRepository.findByRoleName("USER");
        return ExcelReportGenerator.generarReporteClientes(clientes, appointmentRepository);
    }


    // Reporte de Trabajadores CORREO
    public void enviarReporteTrabajadores(String correo) {
        List<UserModel> trabajadores = userRepository.findByRoleName("WORKER");

        byte[] excel = ExcelReportGenerator.generarReporteTrabajadores(trabajadores);

        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Trabajadores",
                "Adjunto encontrarás el reporte de trabajadores en formato Excel.",
                excel,
                "ReporteTrabajadores.xlsx"
        );
    }
    //DESCARGAR PC
    public byte[] generarExcelTrabajadores() {
        List<UserModel> trabajadores = userRepository.findByRoleName("WORKER");
        return ExcelReportGenerator.generarReporteTrabajadores(trabajadores);
    }



    // Reporte de ServiciosCOREO
    public void enviarReporteServicios(String correo) {
        List<ServiceModel> servicios = serviceRepository.findAll();
        byte[] excel = ExcelReportGenerator.generarReporteServicios(servicios);
        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Servicios",
                "Adjunto encontrarás el reporte de servicios en formato Excel.",
                excel,
                "ReporteServicios.xlsx"
        );
    }
    // DESCARGAR PC
    public byte[] generarExcelServicios() {
        List<ServiceModel> servicios = serviceRepository.findAll();
        return ExcelReportGenerator.generarReporteServicios(servicios);
    }


    // Repotte de Reservas ALcoreo
    public void enviarReporteReservas(String correo) {
        List<AppointmentModel> reservas = appointmentRepository.findAll(); // o filtrado si quieres
        byte[] excel = ExcelReportGenerator.generarReporteReservas(reservas);

        emailService.enviarCorreoConAdjunto(
                correo,
                "Reporte de Reservas",
                "Adjunto encontrarás el reporte de reservas en formato Excel.",
                excel,
                "ReporteReservas.xlsx"
        );
    }
    //descargar oc
    public byte[] generarExcelReservas() {
        List<AppointmentModel> reservas = appointmentRepository.findAll();
        return ExcelReportGenerator.generarReporteReservas(reservas);
    }

}
