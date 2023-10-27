package com.example.demo.model.repositorio;

import com.example.demo.model.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
   
	Usuario findByCorreo(String correo);
}
