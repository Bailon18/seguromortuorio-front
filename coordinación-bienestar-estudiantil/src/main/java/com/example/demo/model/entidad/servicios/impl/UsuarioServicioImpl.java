package com.example.demo.model.entidad.servicios.impl;

import com.example.demo.model.entidad.Rol;
import com.example.demo.model.entidad.Usuario;
import com.example.demo.model.entidad.servicios.UsuarioServicio;
import com.example.demo.model.repositorio.RolRepositorio;
import com.example.demo.model.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServicioImpl implements UsuarioServicio {

	@Autowired
	private UsuarioRepositorio usuarioRepositorio;
	
	@Autowired
	private RolRepositorio rolRepositorio;

    @Override
    public void guardarUsuario(Usuario usuario, Long rolId) {
     
        Rol rol = rolRepositorio.findById(rolId).orElse(null);
        
        if (rol != null) {
            usuario.setRoles(rol);
            usuario.setEstado(1);
            usuarioRepositorio.save(usuario);
        } 
    }

	@Override
	public Usuario obtenerUsuarioPorId(Long id) {
		return usuarioRepositorio.findById(id).orElse(null);
	}

	@Override
	public List<Usuario> obtenerTodosLosUsuarios() {
		return usuarioRepositorio.findAll(Sort.by(Sort.Direction.DESC, "id"));
	}

	@Override
	public void bloquearUsuario(Long id, int estado) {

		Usuario usuario = usuarioRepositorio.findById(id).orElse(null);
		if (usuario != null) {
			usuario.setEstado(estado);
			usuarioRepositorio.save(usuario);
		}
	}

	@Override
	public boolean validarCredenciales(String correo, String contrasena) {

		Usuario usuario = usuarioRepositorio.findByCorreo(correo);

		if (usuario != null) {

			if (usuario.getContrasena().equals(contrasena)) {
				return true;
			}
		}
		return false;
	}
	
	@Override
    public Usuario obtenerUsuarioPorCorreo(String correo) {
        return usuarioRepositorio.findByCorreo(correo);
    }

}
