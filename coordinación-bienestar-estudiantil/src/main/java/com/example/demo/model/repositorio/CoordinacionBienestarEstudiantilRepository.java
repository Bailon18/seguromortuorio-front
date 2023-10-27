package com.example.demo.model.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.entidad.CoordinacionBienestarEstudiantil;


public interface CoordinacionBienestarEstudiantilRepository extends JpaRepository<CoordinacionBienestarEstudiantil, Long> {

	List<CoordinacionBienestarEstudiantil> findByUsuarioIdOrderByIdDesc(Long usuarioId);
}
