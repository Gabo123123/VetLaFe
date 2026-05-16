package com.veterinaria.lafe.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.veterinaria.lafe.Entities.Consulta;

import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByMascotaId(Long mascotaId);
}
