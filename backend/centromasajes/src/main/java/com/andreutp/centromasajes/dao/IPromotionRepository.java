package com.andreutp.centromasajes.dao;

import com.andreutp.centromasajes.model.PromotionModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPromotionRepository extends JpaRepository<PromotionModel, Long>{
    List<PromotionModel> findByActiveTrue();
}
