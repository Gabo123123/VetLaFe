package com.veterinaria.lafe.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "mascotas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mascota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "nombre", nullable = false)
    private String nombre;
    
    @Column(name = "raza")
    private String raza;
    
    @Column(name = "edad")
    private Integer edad;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnore
    private Cliente cliente;
    
    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Consulta> consultas;
}
