package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IPromotionRepository;
import com.andreutp.centromasajes.model.PromotionModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {

    @Mock
    private IPromotionRepository promotionRepository;

    @InjectMocks
    private PromotionService promotionService;

    private PromotionModel testPromotion;

    @BeforeEach
    void setUp() {
        testPromotion = new PromotionModel();
        testPromotion.setId(1L);
        testPromotion.setName("Promoción Verano");
        testPromotion.setDescription("Descuento en masajes");
        testPromotion.setDiscountPercent(new BigDecimal("20.00"));
        testPromotion.setDiscountAmount(BigDecimal.ZERO);
        testPromotion.setStartDate(LocalDate.now());
        testPromotion.setEndDate(LocalDate.now().plusDays(30));
        testPromotion.setActive(true);
    }

    @Test
    void testCreatePromotion_WithDates() {
        // Arrange
        when(promotionRepository.save(any(PromotionModel.class))).thenReturn(testPromotion);

        // Act
        PromotionModel result = promotionService.createPromotion(testPromotion);

        // Assert
        assertNotNull(result);
        assertEquals("Promoción Verano", result.getName());
        assertNotNull(result.getStartDate());
        assertNotNull(result.getEndDate());
        verify(promotionRepository, times(1)).save(testPromotion);
    }

    @Test
    void testCreatePromotion_WithoutDates() {
        // Arrange
        PromotionModel promotionWithoutDates = new PromotionModel();
        promotionWithoutDates.setName("Nueva Promoción");
        promotionWithoutDates.setActive(true);

        when(promotionRepository.save(any(PromotionModel.class))).thenReturn(promotionWithoutDates);

        // Act
        PromotionModel result = promotionService.createPromotion(promotionWithoutDates);

        // Assert
        assertNotNull(result);
        verify(promotionRepository, times(1)).save(promotionWithoutDates);
    }

    @Test
    void testGetActivePromotions() {
        // Arrange
        PromotionModel promo2 = new PromotionModel();
        promo2.setId(2L);
        promo2.setName("Promoción Invierno");
        promo2.setActive(true);

        List<PromotionModel> promotions = Arrays.asList(testPromotion, promo2);
        when(promotionRepository.findByActiveTrue()).thenReturn(promotions);

        // Act
        List<PromotionModel> result = promotionService.getActivePromotions();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(promotionRepository, times(1)).findByActiveTrue();
    }

    @Test
    void testGetPromotionById_Success() {
        // Arrange
        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromotion));

        // Act
        PromotionModel result = promotionService.getPromotionById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Promoción Verano", result.getName());
        verify(promotionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPromotionById_NotFound() {
        // Arrange
        when(promotionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            promotionService.getPromotionById(999L);
        });

        assertEquals("Promoción no encontrada", exception.getMessage());
    }

    @Test
    void testUpdatePromotion_Success() {
        // Arrange
        PromotionModel updatedPromotion = new PromotionModel();
        updatedPromotion.setName("Promoción Actualizada");
        updatedPromotion.setDescription("Nueva descripción");
        updatedPromotion.setDiscountPercent(new BigDecimal("25.00"));
        updatedPromotion.setDiscountAmount(new BigDecimal("50.00"));
        updatedPromotion.setStartDate(LocalDate.now().plusDays(1));
        updatedPromotion.setEndDate(LocalDate.now().plusDays(31));
        updatedPromotion.setActive(false);

        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromotion));
        when(promotionRepository.save(any(PromotionModel.class))).thenReturn(testPromotion);

        // Act
        PromotionModel result = promotionService.updatePromotion(1L, updatedPromotion);

        // Assert
        assertNotNull(result);
        assertEquals("Promoción Actualizada", result.getName());
        assertEquals("Nueva descripción", result.getDescription());
        assertEquals(new BigDecimal("25.00"), result.getDiscountPercent());
        assertFalse(result.getActive());

        verify(promotionRepository, times(2)).findById(1L); // Called twice in service
        verify(promotionRepository, times(1)).save(testPromotion);
    }
/*
    @Test
    void testUpdatePromotion_WithNullDates() {
        // Arrange
        PromotionModel updatedPromotion = new PromotionModel();
        updatedPromotion.setName("Promoción Actualizada");
        updatedPromotion.setDescription("Nueva descripción");
        updatedPromotion.setDiscountPercent(new BigDecimal("15.00"));
        updatedPromotion.setDiscountAmount(BigDecimal.ZERO);
        updatedPromotion.setStartDate(null);
        updatedPromotion.setEndDate(null);
        updatedPromotion.setActive(true);

        LocalDateTime originalStart = testPromotion.getStartDate();
        LocalDateTime originalEnd = testPromotion.getEndDate();

        when(promotionRepository.findById(1L)).thenReturn(Optional.of(testPromotion));
        when(promotionRepository.save(any(PromotionModel.class))).thenReturn(testPromotion);

        // Act
        PromotionModel result = promotionService.updatePromotion(1L, updatedPromotion);

        // Assert
        assertNotNull(result);
        assertEquals(originalStart, result.getStartDate());
        assertEquals(originalEnd, result.getEndDate());
        verify(promotionRepository, times(1)).save(testPromotion);
    }*/

    @Test
    void testUpdatePromotion_NotFound() {
        // Arrange
        when(promotionRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            promotionService.updatePromotion(999L, testPromotion);
        });

        assertEquals("Promoción no encontrada", exception.getMessage());
        verify(promotionRepository, never()).save(any(PromotionModel.class));
    }

    @Test
    void testDeletePromotion() {
        // Arrange
        doNothing().when(promotionRepository).deleteById(1L);

        // Act
        promotionService.deletePromotion(1L);

        // Assert
        verify(promotionRepository, times(1)).deleteById(1L);
    }
}