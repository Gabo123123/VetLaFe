package com.veterinaria.lafe.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veterinaria.lafe.Entities.Mascota;
import com.veterinaria.lafe.Services.MascotaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/mascotas")
@CrossOrigin(origins = "*")
public class MascotaController {
    
    @Autowired
    private MascotaService mascotaService;
    
    @GetMapping
    public ResponseEntity<List<Mascota>> obtenerTodas() {
        List<Mascota> mascotas = mascotaService.obtenerTodas();
        return ResponseEntity.ok(mascotas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Mascota> obtenerPorId(@PathVariable Long id) {
        Optional<Mascota> mascota = mascotaService.obtenerPorId(id);
        return mascota.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Mascota>> obtenerPorCliente(@PathVariable Long clienteId) {
        List<Mascota> mascotas = mascotaService.obtenerPorClienteId(clienteId);
        return ResponseEntity.ok(mascotas);
    }
    
    @PostMapping
    public ResponseEntity<Mascota> crear(@RequestBody MascotaRequest request) {
        Mascota mascota = new Mascota();
        mascota.setNombre(request.getNombre());
        mascota.setRaza(request.getRaza());
        mascota.setEdad(request.getEdad());
        
        Mascota nuevaMascota = mascotaService.crear(mascota, request.getClienteId());
        if (nuevaMascota != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaMascota);
        }
        return ResponseEntity.badRequest().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Mascota> actualizar(@PathVariable Long id, @RequestBody Mascota mascota) {
        Mascota mascotaActualizada = mascotaService.actualizar(id, mascota);
        if (mascotaActualizada != null) {
            return ResponseEntity.ok(mascotaActualizada);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        mascotaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

class MascotaRequest {
    private String nombre;
    private String raza;
    private Integer edad;
    private Long clienteId;
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getRaza() {
        return raza;
    }
    
    public void setRaza(String raza) {
        this.raza = raza;
    }
    
    public Integer getEdad() {
        return edad;
    }
    
    public void setEdad(Integer edad) {
        this.edad = edad;
    }
    
    public Long getClienteId() {
        return clienteId;
    }
    
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }
}
