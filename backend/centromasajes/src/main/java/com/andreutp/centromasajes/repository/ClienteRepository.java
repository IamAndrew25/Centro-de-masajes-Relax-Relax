package com.andreutp.centromasajes.repository;

import com.andreutp.centromasajes.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
