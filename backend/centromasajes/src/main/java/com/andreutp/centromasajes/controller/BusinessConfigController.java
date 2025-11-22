package com.andreutp.centromasajes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.andreutp.centromasajes.model.BusinessConfigModel;
import com.andreutp.centromasajes.service.BusinessConfigService;

@RestController
@RequestMapping("/config")
public class BusinessConfigController {

    private final BusinessConfigService service;

    @Autowired
    public BusinessConfigController(BusinessConfigService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<BusinessConfigModel> getConfig() {
        return ResponseEntity.ok(service.getConfig());
    }

    @PutMapping
    public ResponseEntity<BusinessConfigModel> updateConfig(@RequestBody BusinessConfigModel config) {
        return ResponseEntity.ok(service.updateConfig(config));
    }
}
