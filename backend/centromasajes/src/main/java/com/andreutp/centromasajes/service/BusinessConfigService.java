package com.andreutp.centromasajes.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.andreutp.centromasajes.dao.IBusinessConfigRepository;
import com.andreutp.centromasajes.model.BusinessConfigModel;

@Service
public class BusinessConfigService {

    private final IBusinessConfigRepository repository;

    public BusinessConfigService(IBusinessConfigRepository repository) {
        this.repository = repository;
    }

    public BusinessConfigModel getConfig() {
        Optional<BusinessConfigModel> any = repository.findAll().stream().findFirst();
        return any.orElseGet(() -> {
            BusinessConfigModel def = BusinessConfigModel.builder()
                    .name("Relax Total")
                    .address("Av. Principal 123, Ciudad")
                    .phone("+1 (555) 123-4567")
                    .email("info@relaxtotal.com")
                    .schedule(null)
                    .build();
            return repository.save(def);
        });
    }

    public BusinessConfigModel updateConfig(BusinessConfigModel updated) {
        Optional<BusinessConfigModel> any = repository.findAll().stream().findFirst();
        if (any.isPresent()) {
            BusinessConfigModel existing = any.get();
            existing.setName(updated.getName());
            existing.setAddress(updated.getAddress());
            existing.setPhone(updated.getPhone());
            existing.setEmail(updated.getEmail());
            existing.setSchedule(updated.getSchedule());
            return repository.save(existing);
        } else {
            return repository.save(updated);
        }
    }
}
