package com.veterinaria.lafe.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veterinaria.lafe.Entities.Cliente;
import com.veterinaria.lafe.Services.ClienteService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;
    
    @GetMapping
    public ResponseEntity<List<Cliente>> obtenerTodos() {
        List<Cliente> clientes = clienteService.obtenerTodos();
        return ResponseEntity.ok(clientes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.obtenerPorId(id);
        return cliente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        Cliente nuevoCliente = clienteService.crear(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        Cliente clienteActualizado = clienteService.actualizar(id, cliente);
        if (clienteActualizado != null) {
            return ResponseEntity.ok(clienteActualizado);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
