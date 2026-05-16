package com.veterinaria.lafe.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.veterinaria.lafe.Entities.Consulta;
import com.veterinaria.lafe.Entities.Mascota;
import com.veterinaria.lafe.Repository.ConsultaRepository;
import com.veterinaria.lafe.Repository.MascotaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {
    
    @Autowired
    private ConsultaRepository consultaRepository;
    
    @Autowired
    private MascotaRepository mascotaRepository;
    
    public List<Consulta> obtenerTodas() {
        return consultaRepository.findAll();
    }
    
    public Optional<Consulta> obtenerPorId(Long id) {
        return consultaRepository.findById(id);
    }
    
    public List<Consulta> obtenerPorMascotaId(Long mascotaId) {
        return consultaRepository.findByMascotaId(mascotaId);
    }
    
    public Consulta crear(Consulta consulta, Long mascotaId) {
        Optional<Mascota> mascota = mascotaRepository.findById(mascotaId);
        if (mascota.isPresent()) {
            consulta.setMascota(mascota.get());
            if (consulta.getEstado() == null) {
                consulta.setEstado("Pendiente");
            }
            return consultaRepository.save(consulta);
        }
        return null;
    }
    
    public Consulta actualizar(Long id, Consulta consultaActualizada) {
        Optional<Consulta> consulta = consultaRepository.findById(id);
        if (consulta.isPresent()) {
            Consulta c = consulta.get();
            c.setFechaHora(consultaActualizada.getFechaHora());
            c.setMotivo(consultaActualizada.getMotivo());
            c.setEstado(consultaActualizada.getEstado());
            c.setPeso(consultaActualizada.getPeso());
            c.setTemperatura(consultaActualizada.getTemperatura());
            c.setSintomas(consultaActualizada.getSintomas());
            c.setDiagnostico(consultaActualizada.getDiagnostico());
            c.setReceta(consultaActualizada.getReceta());
            return consultaRepository.save(c);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        consultaRepository.deleteById(id);
    }
}
