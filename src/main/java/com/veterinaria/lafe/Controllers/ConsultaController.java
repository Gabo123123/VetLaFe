package com.veterinaria.lafe.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.veterinaria.lafe.Entities.Consulta;
import com.veterinaria.lafe.Services.ConsultaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {
    
    @Autowired
    private ConsultaService consultaService;
    
    @GetMapping
    public ResponseEntity<List<Consulta>> obtenerTodas() {
        List<Consulta> consultas = consultaService.obtenerTodas();
        return ResponseEntity.ok(consultas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Consulta> obtenerPorId(@PathVariable Long id) {
        Optional<Consulta> consulta = consultaService.obtenerPorId(id);
        return consulta.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/mascota/{mascotaId}")
    public ResponseEntity<List<Consulta>> obtenerPorMascota(@PathVariable Long mascotaId) {
        List<Consulta> consultas = consultaService.obtenerPorMascotaId(mascotaId);
        return ResponseEntity.ok(consultas);
    }
    
    @PostMapping
    public ResponseEntity<Consulta> crear(@RequestBody ConsultaRequest request) {
        Consulta consulta = new Consulta();
        consulta.setFechaHora(request.getFechaHora());
        consulta.setMotivo(request.getMotivo());
        consulta.setEstado(request.getEstado() != null ? request.getEstado() : "Pendiente");
        
        Consulta nuevaConsulta = consultaService.crear(consulta, request.getMascotaId());
        if (nuevaConsulta != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaConsulta);
        }
        return ResponseEntity.badRequest().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Consulta> actualizar(@PathVariable Long id, @RequestBody Consulta consulta) {
        Consulta consultaActualizada = consultaService.actualizar(id, consulta);
        if (consultaActualizada != null) {
            return ResponseEntity.ok(consultaActualizada);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        consultaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

class ConsultaRequest {
    private java.time.LocalDateTime fechaHora;
    private String motivo;
    private String estado;
    private Long mascotaId;
    
    public java.time.LocalDateTime getFechaHora() {
        return fechaHora;
    }
    
    public void setFechaHora(java.time.LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public Long getMascotaId() {
        return mascotaId;
    }
    
    public void setMascotaId(Long mascotaId) {
        this.mascotaId = mascotaId;
    }
}
