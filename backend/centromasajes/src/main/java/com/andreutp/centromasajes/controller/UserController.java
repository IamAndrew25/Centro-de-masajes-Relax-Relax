package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dao.IWorkerAvailabilityRepository;
import com.andreutp.centromasajes.dto.UserClientDTO;
import com.andreutp.centromasajes.dto.UserWorkerDTO;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.model.WorkerAvailabilityModel;
import com.andreutp.centromasajes.service.UserService;
import com.andreutp.centromasajes.model.UserModel;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private IRoleRepository roleRepository;
    @Autowired
    private IWorkerAvailabilityRepository availabilityRepository;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IAppointmentRepository appointmentRepository;

    @GetMapping("/all") // GET /user/all
    public ArrayList<UserModel> getUsers(){
        return this.userService.getUsers();
    }

    @PostMapping
    public UserModel saveUser(@Valid @RequestBody UserModel user){
        return  this.userService.saveUser(user);
    }

    @GetMapping(path = "/{id}")
    public Optional<UserModel> getUserById(@PathVariable("id") Long id){
        return this.userService.getById(id);
    }

    @PutMapping(path = "/{id}")
    public UserModel updateUserById(@Valid @RequestBody UserModel request, @PathVariable("id") Long id){
        return this.userService.updateById(request, id);
    }

    @DeleteMapping(path = "/{id}")
    public String deleteById(@PathVariable("id") Long id){
        boolean ok = this.userService.deleteUser(id);

        if (ok){
            return "user con id" +id+ "se elimino";
        }else{
            return "no se elimino a "+id;
        }

    }

    @GetMapping("/clients")
    public ResponseEntity<List<UserClientDTO>> getClients() {
        return ResponseEntity.ok(userService.getClients());
    }



    @GetMapping("/workers")
    public List<UserWorkerDTO> getWorkers() {
        return userService.getWorkers();
    }


    @PostMapping("/worker")
    public UserModel saveWorker(@RequestBody UserModel worker) {
        // Buscar el rol WORKER en la BD
        RoleModel roleWorker = roleRepository.findByName("WORKER");


        // Asignar el rol al nuevo trabajador
        worker.setRole(roleWorker);

        // Habilitar por defecto si no se envía
        if (worker.getEnabled() == null) {
            worker.setEnabled(true);
        }

        // Guardar en BD
        return userService.saveUser(worker);
    }


    @PutMapping("/worker/{id}")
    public UserModel updateWorker(@RequestBody UserModel worker, @PathVariable Long id) {
        return userService.updateWorker(worker, id);
    }

    @DeleteMapping("/worker/{id}")
    public String deleteWorker(@PathVariable Long id) {
        boolean ok = userService.deleteUser(id);
        return ok ? "Trabajador eliminado" : "No se pudo eliminar";
    }

    @GetMapping("/worker/{id}/availability/{day}")
    public List<String> getAvailableSlotsByDayOfWeek(
            @PathVariable Long id,
            @PathVariable String day,
            @RequestParam int durationMinutes) {

        // Normalizar día recibido (MARTES, MiErCoLeS...)
        String normalizedDay = day.trim().toUpperCase();

        Optional<UserModel> workerOpt = userRepository.findById(id);
        if (workerOpt.isEmpty()) return new ArrayList<>();

        UserModel worker = workerOpt.get();

        WorkerAvailabilityModel availability = worker.getAvailability().stream()
                .filter(a -> a.getDay().equalsIgnoreCase(normalizedDay)
                        && Boolean.TRUE.equals(a.getActivo()))
                .findFirst()
                .orElse(null);

        if (availability == null) return new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime start = LocalTime.parse(availability.getInicio(), formatter);
        LocalTime end = LocalTime.parse(availability.getFin(), formatter);

        List<String> slots = new ArrayList<>();
        LocalTime current = start;

        while (!current.plusMinutes(durationMinutes).isAfter(end)) {
            slots.add(current.format(formatter));
            current = current.plusMinutes(durationMinutes);
        }

        return slots;
    }


    private String mapDayToSpanish(LocalDate date) {
        switch (date.getDayOfWeek()) {
            case MONDAY: return "LUNES";
            case TUESDAY: return "MARTES";
            case WEDNESDAY: return "MIERCOLES";
            case THURSDAY: return "JUEVES";
            case FRIDAY: return "VIERNES";
            case SATURDAY: return "SABADO";
            case SUNDAY: return "DOMINGO";
            default: return "";
        }
    }

    @GetMapping("/worker/{id}/availability/date/{date}")
    public List<String> getAvailableSlotsByDate(
            @PathVariable Long id,
            @PathVariable String date,
            @RequestParam int durationMinutes) {

        LocalDate fecha = LocalDate.parse(date);

        // Convertimos al nombre EXACTO como está en la BD
        String dayOfWeek = mapDayToSpanish(fecha);

        Optional<UserModel> workerOpt = userRepository.findById(id);
        if (workerOpt.isEmpty()) return new ArrayList<>();

        UserModel worker = workerOpt.get();

        WorkerAvailabilityModel availability = worker.getAvailability().stream()
                .filter(a -> a.getDay().equalsIgnoreCase(dayOfWeek)
                        && Boolean.TRUE.equals(a.getActivo()))
                .findFirst()
                .orElse(null);

        if (availability == null) return new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime start = LocalTime.parse(availability.getInicio(), formatter);
        LocalTime end = LocalTime.parse(availability.getFin(), formatter);

        List<AppointmentModel> citas = appointmentRepository.findByWorkerId(id)
                .stream()
                .filter(a -> a.getAppointmentStart().toLocalDate().equals(fecha))
                .collect(Collectors.toList());

        List<UserService.TimeInterval> ocupados = citas.stream()
                .map(c -> new UserService.TimeInterval(
                        c.getAppointmentStart().toLocalTime(),
                        c.getAppointmentEnd().toLocalTime()))
                .toList();

        List<String> availableSlots = new ArrayList<>();
        LocalTime current = start;

        while (!current.plusMinutes(durationMinutes).isAfter(end)) {

            final LocalTime slotStart = current;
            LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);

            boolean conflict = ocupados.stream().anyMatch(ti ->
                    !(slotEnd.isBefore(ti.getStart()) || slotStart.isAfter(ti.getEnd()))
            );

            if (!conflict) {
                availableSlots.add(slotStart.format(formatter));
            }

            current = current.plusMinutes(10);
        }

        return availableSlots;
    }



    @PostMapping("/worker/{id}/availability")
    public ResponseEntity<?> saveWorkerAvailability(
            @PathVariable Long id,
            @RequestBody List<WorkerAvailabilityModel> availabilityList) {

        try {
            userService.saveWorkerAvailability(id, availabilityList);
            return ResponseEntity.ok("Disponibilidad guardada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar disponibilidad: " + e.getMessage());
        }
    }


}
