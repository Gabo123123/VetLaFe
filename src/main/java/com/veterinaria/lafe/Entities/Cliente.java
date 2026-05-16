package com.veterinaria.lafe.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "dni", unique = true, nullable = false)
    private String dni;
    
    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;
    
    @Column(name = "telefono")
    private String telefono;
    
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mascota> mascotas;
}
