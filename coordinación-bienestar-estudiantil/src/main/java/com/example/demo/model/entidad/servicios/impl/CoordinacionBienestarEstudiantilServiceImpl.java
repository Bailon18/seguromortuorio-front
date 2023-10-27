package com.example.demo.model.entidad.servicios.impl;

import com.example.demo.model.entidad.servicios.CoordinacionBienestarEstudiantilService;
import com.example.demo.model.repositorio.CoordinacionBienestarEstudiantilRepository;
import com.example.demo.model.entidad.CoordinacionBienestarEstudiantil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoordinacionBienestarEstudiantilServiceImpl implements CoordinacionBienestarEstudiantilService {

	@Autowired
    private CoordinacionBienestarEstudiantilRepository coordinacionRepository;


    @Override
    public List<CoordinacionBienestarEstudiantil> obtenerTodasLasCoordinaciones() {
        return coordinacionRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @Override
    public List<CoordinacionBienestarEstudiantil> obtenerCoordinacionesPorUsuarioId(Long usuarioId) {
        return coordinacionRepository.findByUsuarioIdOrderByIdDesc(usuarioId);
    }

    @Override
    public Optional<CoordinacionBienestarEstudiantil> obtenerCoordinacionPorId(Long id) {
        return coordinacionRepository.findById(id);
    }

    @Override
    public CoordinacionBienestarEstudiantil agregarCoordinacion(CoordinacionBienestarEstudiantil coordinacion) {
        return coordinacionRepository.save(coordinacion);
    }

    @Override
    public void eliminarCoordinacion(Long id) {
        coordinacionRepository.deleteById(id);
    }
}
