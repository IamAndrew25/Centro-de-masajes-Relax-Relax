package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IPlanRepository;
import com.andreutp.centromasajes.model.PlanModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {
    @Autowired
    private final IPlanRepository planRepository;

    public PlanService(IPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public List<PlanModel> getAllPlans() {
        return planRepository.findAll();
    }

    public PlanModel getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public PlanModel savePlan(PlanModel plan) {
        // Validación: no duplicar nombre
        if (planRepository.findByName(plan.getName()).isPresent()) {
            throw new RuntimeException("Ya existe un plan con ese nombre");
        }
        plan.setCreatedAt(java.time.LocalDateTime.now());
        return planRepository.save(plan);
    }

    public PlanModel updatePlan(Long id, PlanModel newPlan) {
        PlanModel existing = getPlanById(id);
        existing.setName(newPlan.getName());
        existing.setDescription(newPlan.getDescription());
        existing.setPrice(newPlan.getPrice());
        existing.setDurationDays(newPlan.getDurationDays());
        return planRepository.save(existing);
    }

    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
