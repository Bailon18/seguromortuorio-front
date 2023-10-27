package com.example.demo.model.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entidad.Rol;

public interface RolRepositorio extends JpaRepository<Rol, Long> {
   
}