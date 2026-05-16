package com.veterinaria.lafe.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.veterinaria.lafe.Entities.Cliente;
import com.veterinaria.lafe.Entities.Mascota;
import com.veterinaria.lafe.Repository.ClienteRepository;
import com.veterinaria.lafe.Repository.MascotaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MascotaService {
    
    @Autowired
    private MascotaRepository mascotaRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Mascota> obtenerTodas() {
        return mascotaRepository.findAll();
    }
    
    public Optional<Mascota> obtenerPorId(Long id) {
        return mascotaRepository.findById(id);
    }
    
    public List<Mascota> obtenerPorClienteId(Long clienteId) {
        return mascotaRepository.findByClienteId(clienteId);
    }
    
    public Mascota crear(Mascota mascota, Long clienteId) {
        Optional<Cliente> cliente = clienteRepository.findById(clienteId);
        if (cliente.isPresent()) {
            mascota.setCliente(cliente.get());
            return mascotaRepository.save(mascota);
        }
        return null;
    }
    
    public Mascota actualizar(Long id, Mascota mascotaActualizada) {
        Optional<Mascota> mascota = mascotaRepository.findById(id);
        if (mascota.isPresent()) {
            Mascota m = mascota.get();
            m.setNombre(mascotaActualizada.getNombre());
            m.setRaza(mascotaActualizada.getRaza());
            m.setEdad(mascotaActualizada.getEdad());
            return mascotaRepository.save(m);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        mascotaRepository.deleteById(id);
    }
}
