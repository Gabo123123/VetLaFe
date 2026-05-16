package com.veterinaria.lafe.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veterinaria.lafe.Entities.Mascota;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByClienteId(Long clienteId);
}
