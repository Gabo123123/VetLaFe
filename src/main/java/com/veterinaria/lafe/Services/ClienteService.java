package com.veterinaria.lafe.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.veterinaria.lafe.Entities.Cliente;
import com.veterinaria.lafe.Repository.ClienteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }
    
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Cliente crear(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    public Cliente actualizar(Long id, Cliente clienteActualizado) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            Cliente c = cliente.get();
            c.setDni(clienteActualizado.getDni());
            c.setNombreCompleto(clienteActualizado.getNombreCompleto());
            c.setTelefono(clienteActualizado.getTelefono());
            return clienteRepository.save(c);
        }
        return null;
    }
    
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}
