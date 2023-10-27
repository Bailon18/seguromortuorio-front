package com.example.demo.model.entidad;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Usuario {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cedula;
    private String nombre;
    private String apellido;
    private String correo;
    private String contrasena;
    private int estado;

    @OneToOne
    private Rol roles;

    @OneToMany(mappedBy = "usuario")
    private List<CoordinacionBienestarEstudiantil> coordinaciones;

	public Usuario() {

	}

	public Usuario(Long id, String cedula, String nombre, String apellido, String correo, String contrasena,
			Rol roles) {
		super();
		this.id = id;
		this.cedula = cedula;
		this.nombre = nombre;
		this.apellido = apellido;
		this.correo = correo;
		this.contrasena = contrasena;
		this.estado = 1;
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCedula() {
		return cedula;
	}

	public void setCedula(String cedula) {
		this.cedula = cedula;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public String getContrasena() {
		return contrasena;
	}

	public void setContrasena(String contrasena) {
		this.contrasena = contrasena;
	}

	public int getEstado() {
		return estado;
	}

	public void setEstado(int estado) {
		this.estado = estado;
	}

	public Rol getRoles() {
		return roles;
	}

	public void setRoles(Rol roles) {
		this.roles = roles;
	}

	public List<CoordinacionBienestarEstudiantil> getCoordinaciones() {
		return coordinaciones;
	}

	public void setCoordinaciones(List<CoordinacionBienestarEstudiantil> coordinaciones) {
		this.coordinaciones = coordinaciones;
	}
	

}
