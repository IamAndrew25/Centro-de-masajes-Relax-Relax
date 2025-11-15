package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dao.IRoleRepository;
import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dao.IWorkerAvailabilityRepository;
import com.andreutp.centromasajes.dto.UserClientDTO;
import com.andreutp.centromasajes.dto.UserWorkerDTO;
import com.andreutp.centromasajes.model.RoleModel;
import com.andreutp.centromasajes.model.WorkerAvailabilityModel;
import com.andreutp.centromasajes.service.UserService;
import com.andreutp.centromasajes.model.UserModel;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    public List<String> getAvailableSlots(
            @PathVariable Long id,
            @PathVariable String day,
            @RequestParam int durationMinutes) {
        return userService.getAvailableSlots(id, day, durationMinutes);
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
