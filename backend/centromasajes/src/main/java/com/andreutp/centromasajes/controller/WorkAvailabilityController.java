package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.dao.IUserRepository;
import com.andreutp.centromasajes.dao.IWorkerAvailabilityRepository;
import com.andreutp.centromasajes.model.WorkerAvailabilityModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class WorkAvailabilityController {
    @Autowired
    private IWorkerAvailabilityRepository availabilityRepository;

    @Autowired
    private IUserRepository userRepository;

    @GetMapping("/{workerId}")
    public List<WorkerAvailabilityModel> getByWorker(@PathVariable Long workerId) {
        return availabilityRepository.findByWorkerId(workerId);
    }

    @PostMapping("/{workerId}")
    public WorkerAvailabilityModel addAvailability(@PathVariable Long workerId, @RequestBody WorkerAvailabilityModel availability) {
        var worker = userRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        availability.setWorker(worker);
        return availabilityRepository.save(availability);
    }

    @DeleteMapping("/{id}")
    public void deleteAvailability(@PathVariable Long id) {
        availabilityRepository.deleteById(id);
    }
}
