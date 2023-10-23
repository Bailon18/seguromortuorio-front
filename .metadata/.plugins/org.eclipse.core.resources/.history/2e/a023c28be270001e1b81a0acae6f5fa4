package com.museo.modelo.entidades;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "equipos")
public class Equipos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigoEquipo;
    
    @OneToMany(mappedBy = "equipos")
    private List<EquipoTipo> equipoTipos;
    
    private boolean estado ;
	
	public Equipos() {
		this.estado = true;
	}

	public Equipos(Long id, String codigoEquipo) {
		this.id = id;
		this.codigoEquipo = codigoEquipo;
		this.estado = true;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCodigoEquipo() {
		return codigoEquipo;
	}

	public void setCodigoEquipo(String codigoEquipo) {
		this.codigoEquipo = codigoEquipo;
	}

	public boolean isEstado() {
		return estado;
	}

	public void setEstado(boolean estado) {
		this.estado = estado;
	}
	
	
}
