package com.example.demo.model.entidad;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TipoConsulta {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "tipoConsulta")
    private List<CoordinacionBienestarEstudiantil> coordinaciones;

	public TipoConsulta() {

	}
	
	

	public TipoConsulta(Long id) {
		super();
		this.id = id;
	}



	public TipoConsulta(Long id, String nombre, String descripcion) {
		this.id = id;
		this.nombre = nombre;
		this.descripcion = descripcion;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
