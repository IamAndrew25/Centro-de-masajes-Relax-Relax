package com.andreutp.centromasajes.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles") // nombre de la tabla en la BD
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name; // aca ira ADMIN, USER, etc.
}
