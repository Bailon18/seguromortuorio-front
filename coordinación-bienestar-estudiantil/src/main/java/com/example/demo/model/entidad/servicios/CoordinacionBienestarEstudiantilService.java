package com.example.demo.model.entidad.servicios;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entidad.CoordinacionBienestarEstudiantil;

public interface CoordinacionBienestarEstudiantilService {
    
    List<CoordinacionBienestarEstudiantil> obtenerTodasLasCoordinaciones();
    
    List<CoordinacionBienestarEstudiantil> obtenerCoordinacionesPorUsuarioId(Long usuarioId);
    
    Optional<CoordinacionBienestarEstudiantil> obtenerCoordinacionPorId(Long id);
    
    CoordinacionBienestarEstudiantil agregarCoordinacion(CoordinacionBienestarEstudiantil coordinacion);
    
    void eliminarCoordinacion(Long id);
    
}
