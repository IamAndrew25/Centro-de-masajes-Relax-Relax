package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IAppointmentRepository;
import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IWorkerAvailabilityRepository;
import com.andreutp.centromasajes.dto.UserClientDTO;
import com.andreutp.centromasajes.dto.UserWorkerDTO;
import com.andreutp.centromasajes.dto.WorkAvailabilityDTO;
import com.andreutp.centromasajes.model.AppointmentModel;
import com.andreutp.centromasajes.model.UserModel;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.model.WorkerAvailabilityModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private final IUserRepository userRepository;

    @Autowired
    private final IRoleRepository roleRepository;

    @Autowired
    private final IAppointmentRepository appointmentRepository;

    @Autowired
    private final IWorkerAvailabilityRepository availabilityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository,
                       IAppointmentRepository appointmentRepository, IWorkerAvailabilityRepository availabilityRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
    }

    public ArrayList<UserModel> getUsers() {
        return (ArrayList<UserModel>) userRepository.findAll();
    }


    public UserModel saveUser(UserModel user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);

    }

    public Optional<UserModel> getById(Long id) {
        return userRepository.findById(id);
    }

    public UserModel updateById(UserModel request, Long id) {
        UserModel user = userRepository.findById(id).get();

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setDni(request.getDni());
        user.setEnabled(request.getEnabled());
        user.setRole(request.getRole());
        user.setCreatedAt(request.getCreatedAt());
        user.setUpdatedAt(request.getUpdatedAt());

        return user;
    }

    public Boolean deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public List<UserClientDTO> getClients() {
        List<UserModel> users = userRepository.findByRoleName("USER");
        List<UserClientDTO> clients = new ArrayList<>();

        for (UserModel user : users) {
            UserClientDTO dto = new UserClientDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setPhone(user.getPhone());
            dto.setEmail(user.getEmail());

            List<AppointmentModel> citas = appointmentRepository.findByUserIdOrderByAppointmentStartDesc(user.getId());
            if (!citas.isEmpty()) {
                AppointmentModel last = citas.get(0); // última cita
                dto.setUltimaVisita(last.getAppointmentStart().toString());
                dto.setServicios(citas.size());
                dto.setTipoMasaje(last.getService().getName());
            } else {
                dto.setUltimaVisita("-");
                dto.setServicios(0);
                dto.setTipoMasaje("-");
            }

            clients.add(dto);
        }

        return clients;
    }


    public List<UserWorkerDTO> getWorkers() {
        List<UserModel> users = userRepository.findByRoleName("WORKER");
        List<UserWorkerDTO> workers = new ArrayList<>();

        for (UserModel user : users) {
            UserWorkerDTO dto = new UserWorkerDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setPhone(user.getPhone());
            dto.setEmail(user.getEmail());
            dto.setDni(user.getDni());
            dto.setEspecialidad(user.getEspecialidad());
            dto.setEstado(user.getEstado());
            dto.setExperiencia(user.getExperiencia());

            List<WorkerAvailabilityModel> availabilityList = availabilityRepository.findByWorkerId(user.getId());

            List<WorkAvailabilityDTO> schedule = availabilityList.stream().map(a -> {
                WorkAvailabilityDTO wa = new WorkAvailabilityDTO();
                wa.setDay(a.getDay());
                wa.setInicio(a.getInicio());
                wa.setFin(a.getFin());
                wa.setActivo(a.getActivo());
                return wa;
            }).toList();

            dto.setAvailability(schedule);
            workers.add(dto);
        }

        return workers;
    }

    public UserModel updateWorker(UserModel request, Long id) {
        UserModel worker = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        worker.setUsername(request.getUsername());

        // 🔒 Solo cifrar si la contraseña fue cambiada
        if (request.getPassword() != null && !request.getPassword().startsWith("$2a$")) {
            worker.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        worker.setUsername(request.getUsername());
        worker.setPassword(request.getPassword());
        worker.setPhone(request.getPhone());
        worker.setEmail(request.getEmail());
        worker.setDni(request.getDni());
        worker.setEnabled(request.getEnabled());
        worker.setEspecialidad(request.getEspecialidad());
        worker.setEstado(request.getEstado());
        worker.setExperiencia(request.getExperiencia());

        return userRepository.save(worker);
    }


    public List<String> getAvailableSlots(Long workerId, String day, int durationMinutes) {
        Optional<UserModel> workerOpt = userRepository.findById(workerId);
        if (workerOpt.isEmpty()) return new ArrayList<>();

        UserModel worker = workerOpt.get();

        // Buscar disponibilidad del día
        WorkerAvailabilityModel availability = worker.getAvailability().stream()
                .filter(a -> a.getDay().equalsIgnoreCase(day) && Boolean.TRUE.equals(a.getActivo()))
                .findFirst()
                .orElse(null);

        if (availability == null) return new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime inicio = LocalTime.parse(availability.getInicio(), formatter);
        LocalTime fin = LocalTime.parse(availability.getFin(), formatter);

        // Convertir 'day' a LocalDate
        LocalDate fecha = LocalDate.parse(day, DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        // Filtrar citas del día
        List<AppointmentModel> citas = appointmentRepository.findByWorkerId(workerId)
                .stream()
                .filter(a -> a.getAppointmentStart().toLocalDate().equals(fecha))
                .collect(Collectors.toList());

        // Crear lista de intervalos ocupados
        List<TimeInterval> ocupados = citas.stream()
                .map(c -> new TimeInterval(
                        c.getAppointmentStart().toLocalTime(),
                        c.getAppointmentEnd().toLocalTime()
                ))
                .toList();

        List<String> availableSlots = new ArrayList<>();
        LocalTime current = inicio;

        while (!current.plusMinutes(durationMinutes).isAfter(fin)) {
            final LocalTime slotStart = current;
            LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);

            boolean conflict = ocupados.stream().anyMatch(ti ->
                    !(slotEnd.isBefore(ti.getStart()) || slotStart.isAfter(ti.getEnd()))
            );

            if (!conflict) {
                availableSlots.add(slotStart.format(formatter));
            }

            current = current.plusMinutes(10); // avanzar margen
        }

        return availableSlots;
    }

    // Clase auxiliar
    private static class TimeInterval {
        private final LocalTime start;
        private final LocalTime end;

        public TimeInterval(LocalTime start, LocalTime end) {
            this.start = start;
            this.end = end;
        }

        public LocalTime getStart() {
            return start;
        }

        public LocalTime getEnd() {
            return end;
        }
    }

    public void saveWorkerAvailability(Long workerId, List<WorkerAvailabilityModel> availabilityList) {

        UserModel worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        // Elimina la disponibilidad anterior
        availabilityRepository.deleteByWorkerId(workerId);

        // Asocia el trabajador a cada registro y guarda
        for (WorkerAvailabilityModel availability : availabilityList) {
            availability.setWorker(worker);
            availabilityRepository.save(availability);
        }

    }
}
