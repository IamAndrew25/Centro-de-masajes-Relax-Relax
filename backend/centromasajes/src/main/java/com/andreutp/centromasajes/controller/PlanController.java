package com.andreutp.centromasajes.controller;

import com.andreutp.centromasajes.model.PlanModel;
import com.andreutp.centromasajes.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {
    @Autowired
    private PlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanModel>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanModel> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @PostMapping
    public ResponseEntity<PlanModel> createPlan(@RequestBody PlanModel plan) {
        return ResponseEntity.ok(planService.savePlan(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanModel> updatePlan(@PathVariable Long id, @RequestBody PlanModel plan) {
        return ResponseEntity.ok(planService.updatePlan(id, plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
