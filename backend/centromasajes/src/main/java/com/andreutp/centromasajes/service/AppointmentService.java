package com.andreutp.centromasajes.service;


import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IPlanRepository;
import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dto.AppointmentRequest;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private final IAppointmentRepository appointmentRepository;

    @Autowired
    private final IUserRepository userRepository;

    @Autowired
    private final IServiceRepository serviceRepository;

    @Autowired
    private final IPlanRepository planRepository;

    public AppointmentService(IAppointmentRepository appointmentRepository,
                              IUserRepository userRepository,
                              IServiceRepository serviceRepository,
                              IPlanRepository planRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.planRepository = planRepository;
    }

    // Crear cita (validando que el worker no tenga otra a la misma hora)
    public AppointmentModel createAppointment(AppointmentRequest request) {
        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserModel worker = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        ServiceModel service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        AppointmentModel appointment = new AppointmentModel();
        // Validar disponibilidad antes de crear la cita
        if (appointmentRepository.existsByWorkerAndAppointmentStart(worker, request.getAppointmentStart())) {
            throw new RuntimeException("El trabajador ya tiene una cita en ese horario");
        }



        appointment.setUser(user);
        appointment.setWorker(worker);
        appointment.setService(service);
        appointment.setAppointmentStart(request.getAppointmentStart());
        appointment.setAppointmentEnd(request.getAppointmentEnd());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentModel.Status.PENDING);

        // Calcular fin de cita automáticamente
        appointment.setAppointmentEnd(appointment.getAppointmentStart().plusMinutes(service.getDurationMin()));

        return appointmentRepository.save(appointment);
    }

    public List<AppointmentModel> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<AppointmentModel> getAppointmentsByUser(Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return appointmentRepository.findByUser(user);
    }

    public List<AppointmentModel> getAppointmentsByWorker(Long workerId) {
        UserModel worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        return appointmentRepository.findByWorker(worker);
    }

    public AppointmentModel getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
    }

    public AppointmentModel updateAppointmentStatus(Long id, String status) {
        AppointmentModel appointment = getAppointmentById(id);
        appointment.setStatus(AppointmentModel.Status.valueOf(status.toUpperCase()));
        return appointmentRepository.save(appointment);
    }

    public AppointmentModel updateAppointment(Long id, AppointmentRequest request) {
        AppointmentModel existing = getAppointmentById(id);

        UserModel user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel worker = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        ServiceModel service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        existing.setUser(user);
        existing.setWorker(worker);
        existing.setService(service);
        existing.setAppointmentStart(request.getAppointmentStart());
        existing.setAppointmentEnd(request.getAppointmentEnd());
        existing.setStatus(AppointmentModel.Status.valueOf(request.getStatus()));
        existing.setNotes(request.getNotes());

        return appointmentRepository.save(existing);
    }


    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
