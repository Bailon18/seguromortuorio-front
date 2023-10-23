package com.museo.modelo.servicios.impl;

import com.museo.modelo.entidades.Equipos;
import com.museo.modelo.repositorios.EquiposRepository;
import com.museo.modelo.servicios.EquiposService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EquiposServiceImpl implements EquiposService {

    @Autowired
    private EquiposRepository equiposRepository;

    @Override
    public List<Equipos> listarEquiposDescendente() {
        return equiposRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @Override
    public Equipos crearEquipo(Equipos equipo) {
    	
        Equipos nuevoEquipo = equiposRepository.save(equipo);
        // Genera el código de equipo basado en el ID
        String formatoCodigo = "EG-" + String.format("%05d", nuevoEquipo.getId());
        
        nuevoEquipo.setCodigoEquipo(formatoCodigo);
        return equiposRepository.save(nuevoEquipo);
    }


    @Override
    public Equipos obtenerEquipoPorId(Long id) {
        return equiposRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Equipo no encontrado"));
    }

    @Override
    public void eliminarEquipo(Long id) {
        Optional<Equipos> optionalEquipo = equiposRepository.findById(id);
        if (optionalEquipo.isPresent()) {
            Equipos equipo = optionalEquipo.get();
            equipo.setEstado(false); // Cambiar el estado a false
            equiposRepository.save(equipo);
        }
    }
    
}
