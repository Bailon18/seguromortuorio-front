package com.example.demo.model.entidad.servicios;


import java.util.List;

import com.example.demo.model.entidad.Usuario;

public interface UsuarioServicio {
	
	void guardarUsuario(Usuario usuario, Long rolId);
    Usuario obtenerUsuarioPorId(Long id);
    List<Usuario> obtenerTodosLosUsuarios();
    void bloquearUsuario(Long id, int estado);
    boolean validarCredenciales(String correo, String contrasena);
    Usuario obtenerUsuarioPorCorreo(String correo);

}
