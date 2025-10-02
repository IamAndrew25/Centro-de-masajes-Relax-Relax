package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.ServiceModel;
import com.andreutp.centromasajes.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;
    //(Solo adminstrador FALTA CONFIGURAR)

    //crear servicio
    @PostMapping
    public ResponseEntity<ServiceModel> saveService(@Valid @RequestBody ServiceModel service){
        return ResponseEntity.ok(serviceService.saveModelService(service));
    }


    //LISTAR Servicio
    @GetMapping
    public List<ServiceModel> getServices(){
        return serviceService.getAllService();
    }

    //Obtener el servicio por id
    @GetMapping("/{id}")
    public ResponseEntity<ServiceModel> getSeriveByid(@PathVariable Long id){
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    //Actualizar servicios
    @PutMapping("/{id}")
    public ResponseEntity<ServiceModel> updateServiceById(@Valid @PathVariable Long id, ServiceModel  serviceModel){
        return ResponseEntity.ok(serviceService.updateService(id,serviceModel));
    }

    //elimiar servicio por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceById (@PathVariable Long id){
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}