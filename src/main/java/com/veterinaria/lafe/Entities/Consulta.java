package com.veterinaria.lafe.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consulta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;
    
    @Column(name = "motivo")
    private String motivo;
    
    @Column(name = "estado", nullable = false)
    private String estado = "Pendiente";
    
    @Column(name = "peso")
    private Double peso;
    
    @Column(name = "temperatura")
    private Double temperatura;
    
    @Column(name = "sintomas", columnDefinition = "TEXT")
    private String sintomas;
    
    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;
    
    @Column(name = "receta", columnDefinition = "TEXT")
    private String receta;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;
}
