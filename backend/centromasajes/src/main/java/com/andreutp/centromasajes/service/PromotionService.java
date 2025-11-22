package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IPromotionRepository;
import com.andreutp.centromasajes.model.PromotionModel;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromotionService {

    private final IPromotionRepository promotionRepository;

    public PromotionService(IPromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }


    // Crear promoción
    public PromotionModel createPromotion(PromotionModel promotion) {
        if (promotion.getStartDate() == null) {
            promotion.setStartDate(LocalDate.now());
        }
        if (promotion.getEndDate() == null) {
            promotion.setEndDate(promotion.getStartDate().plusDays(7)); // ejemplo: 1 semana de vigencia -- si es que nos olvidamos de poner los datos
                                                                        // se asigna automaticamente
        }
        promotion.setImageUrl(promotion.getImageUrl());

        return promotionRepository.save(promotion);
    }

    // Listar todas las promociones activas
    public List<PromotionModel> getActivePromotions() {
        return promotionRepository.findByActiveTrue();
    }

    // Listar TODAS las promociones (activas e inactivas)
    public List<PromotionModel> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Obtener promoción por ID
    public PromotionModel getPromotionById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
    }

    // Actualizar promoción
    public PromotionModel updatePromotion(Long id, PromotionModel updated) {
        promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));

        PromotionModel existing = getPromotionById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setDiscountPercent(updated.getDiscountPercent());
        existing.setDiscountAmount(updated.getDiscountAmount());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setActive(updated.getActive());
        existing.setImageUrl(updated.getImageUrl());


        // Validamos fechas: si vienen nulas, mantenemos las existentes
        if (updated.getStartDate() != null) {
            existing.setStartDate(updated.getStartDate());
        }
        if (updated.getEndDate() != null) {
            existing.setEndDate(updated.getEndDate());
        }
        return promotionRepository.save(existing);
    }

    // Eliminar promoción
    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }
}
