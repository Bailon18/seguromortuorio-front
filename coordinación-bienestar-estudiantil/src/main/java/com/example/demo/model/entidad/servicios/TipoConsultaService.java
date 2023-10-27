package com.example.demo.model.entidad.servicios;



import com.example.demo.model.entidad.TipoConsulta;
import com.example.demo.model.repositorio.TipoConsultaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoConsultaService {
	
	@Autowired
    private  TipoConsultaRepository tipoConsultaRepository;


    public TipoConsulta obtenerPorId(Long id) {
        return tipoConsultaRepository.findById(id).orElse(null);
    }

}
