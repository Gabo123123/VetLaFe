package com.veterinaria.lafe.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veterinaria.lafe.Entities.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByDni(String dni);
}
