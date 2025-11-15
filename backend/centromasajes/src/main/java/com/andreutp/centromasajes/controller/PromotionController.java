package com.andreutp.centromasajes.controller;


import com.andreutp.centromasajes.model.PromotionModel;
import com.andreutp.centromasajes.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // ------------------------
    // CREAR PROMOCIÓN (ADMIN)
    // ------------------------
    @PostMapping
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionModel> createPromotion(@RequestBody PromotionModel promotion) {
        return ResponseEntity.ok(promotionService.createPromotion(promotion));
    }

    // ------------------------
    // LISTAR PROMOCIONES ACTIVAS (USER, ADMIN, WORKER)
    // ------------------------
    @GetMapping
    //@PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    public ResponseEntity<List<PromotionModel>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    // ------------------------
    // OBTENER PROMOCIÓN POR ID
    // ------------------------
    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('USER','WORKER','ADMIN')")
    public ResponseEntity<PromotionModel> getPromotionById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getPromotionById(id));
    }

    // ------------------------
    // ACTUALIZAR PROMOCIÓN (ADMIN)
    // ------------------------
    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionModel> updatePromotion(@PathVariable Long id,
                                                          @RequestBody PromotionModel promotion) {
        return ResponseEntity.ok(promotionService.updatePromotion(id, promotion));
    }

    // ------------------------
    // ELIMINAR PROMOCIÓN (ADMIN)
    // ------------------------
    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
