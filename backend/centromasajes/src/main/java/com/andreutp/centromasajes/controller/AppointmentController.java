package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dto.AppointmentRequest;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ------------------------
    // CREAR CITA (USER)
    // ------------------------
    @PostMapping
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<AppointmentModel> createAppointment(@RequestBody AppointmentRequest request) {
        AppointmentModel saved = appointmentService.createAppointment(request);
        return ResponseEntity.ok(saved);
    }

    // ------------------------
    // LISTAR TODAS LAS CITAS (ADMIN)
    // ------------------------
    @GetMapping
   // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentModel>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // ------------------------
    // LISTAR CITAS DE UN USUARIO (USER)
    // ------------------------
    @GetMapping("/my")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AppointmentModel>> getUserAppointments(@RequestParam Long userId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(userId));
    }

    // ------------------------
    // LISTAR CITAS ASIGNADAS A UN WORKER (WORKER)
    // ------------------------
    @GetMapping("/worker/{workerId}")
    //@PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<AppointmentModel>> getWorkerAppointments(@PathVariable Long workerId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByWorker(workerId));
    }

    // ------------------------
    // OBTENER CITA POR ID (ADMIN/WORKER/USER según permisos)
    // ------------------------
    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ADMIN','WORKER','USER')")
    public ResponseEntity<AppointmentModel> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    // ------------------------
    // ACTUALIZAR ESTADO DE CITA (WORKER/Admin)
    // ------------------------
    @PatchMapping("/{id}/status")
    //@PreAuthorize("hasAnyRole('WORKER','ADMIN')")
    public ResponseEntity<AppointmentModel> updateStatus(@PathVariable Long id, @RequestParam String status) {
        AppointmentModel updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // ------------------------
    // ACTUALIZAR CITA COMPLETA (ADMIN)
    // ------------------------
    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentModel> updateAppointment(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        AppointmentModel updated = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(updated);
    }

    // ------------------------
    // ELIMINAR CITA (ADMIN)
    // ------------------------
    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
