package com.example.demo.model.entidad;

import java.util.Arrays;

import jakarta.persistence.*;


@Entity
public class CoordinacionBienestarEstudiantil {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String presentacionProblema;
    
    @Column(columnDefinition = "TEXT")
    private String problemaDescripcion;
    
    @Column(columnDefinition = "TEXT")
    private String especialistaDescripcion;
    
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] archivo;
    
    @Column(columnDefinition = "TEXT")
    private String respuestaProblema;

    @ManyToOne
    @JoinColumn(name = "tipoConsulta_id")
    private TipoConsulta tipoConsulta;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    
	public CoordinacionBienestarEstudiantil() {
	}
    
    
	public CoordinacionBienestarEstudiantil(Long id, String presentacionProblema, String problemaDescripcion,
			String especialistaDescripcion, String respuestaProblema,
			Usuario usuario) {
		this.id = id;
		this.presentacionProblema = presentacionProblema;
		this.problemaDescripcion = problemaDescripcion;
		this.especialistaDescripcion = especialistaDescripcion;
		this.respuestaProblema = respuestaProblema;
		this.usuario = usuario;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getPresentacionProblema() {
		return presentacionProblema;
	}


	public void setPresentacionProblema(String presentacionProblema) {
		this.presentacionProblema = presentacionProblema;
	}


	public String getProblemaDescripcion() {
		return problemaDescripcion;
	}


	public void setProblemaDescripcion(String problemaDescripcion) {
		this.problemaDescripcion = problemaDescripcion;
	}


	public String getEspecialistaDescripcion() {
		return especialistaDescripcion;
	}


	public void setEspecialistaDescripcion(String especialistaDescripcion) {
		this.especialistaDescripcion = especialistaDescripcion;
	}


	public byte[] getArchivo() {
		return archivo;
	}


	public void setArchivo(byte[] archivo) {
		this.archivo = archivo;
	}


	public String getRespuestaProblema() {
		return respuestaProblema;
	}


	public void setRespuestaProblema(String respuestaProblema) {
		this.respuestaProblema = respuestaProblema;
	}


	public TipoConsulta getTipoConsulta() {
		return tipoConsulta;
	}


	public void setTipoConsulta(TipoConsulta tipoConsulta) {
		this.tipoConsulta = tipoConsulta;
	}


	public Usuario getUsuario() {
		return usuario;
	}


	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}


	@Override
	public String toString() {
		return "CoordinacionBienestarEstudiantil [id=" + id + ", presentacionProblema=" + presentacionProblema
				+ ", problemaDescripcion=" + problemaDescripcion + ", especialistaDescripcion="
				+ especialistaDescripcion + ", archivo=" + Arrays.toString(archivo) + ", respuestaProblema="
				+ respuestaProblema + ", tipoConsulta=" + tipoConsulta + ", usuario=" + usuario + "]";
	}

	
	

    

}
