package com.example.demo.model.repositorio;


import com.example.demo.model.entidad.TipoConsulta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoConsultaRepository extends JpaRepository<TipoConsulta, Long> {
    
}
