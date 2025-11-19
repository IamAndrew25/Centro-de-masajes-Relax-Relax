package com.andreutp.centromasajes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "business_config")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessConfigModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column
    private String phone;

    @Column
    private String email;

    // JSON or plain text for schedule (simple approach)
    @Column(columnDefinition = "TEXT")
    private String schedule;
}
