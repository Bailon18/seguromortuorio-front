package com.example.demo.controlador;

import com.example.demo.model.entidad.Usuario;
import com.example.demo.model.entidad.servicios.UsuarioServicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/usuarios")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @GetMapping("/")
    public String mostrarFormularioLogin() {
        return "usuarios/login";
    }

    @PostMapping("/login")
    public String iniciarSesion(@RequestParam String correo, @RequestParam String contrasena, Model model) {
        
    	Usuario usuario = usuarioServicio.obtenerUsuarioPorCorreo(correo);
        
        if (usuario != null && usuarioServicio.validarCredenciales(correo, contrasena) && usuario.getEstado() == 1) {
       
            List<Usuario> usuarios = usuarioServicio.obtenerTodosLosUsuarios();
            model.addAttribute("usuarios", usuarios);
            return "inicio"; 
        } else if (usuario != null && usuario.getEstado() == 0) {

            model.addAttribute("error", "Tu cuenta ha sido bloqueada. Por favor, comunícate con el administrador.");
            return "usuarios/login";
        } else {
     
            model.addAttribute("error", "Credenciales inválidas");
            return "usuarios/login";
        }
    }


    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "usuarios/registro";
    }

    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute Usuario usuario, @RequestParam("rolId") Long rolId) {
        usuarioServicio.guardarUsuario(usuario, rolId);
        return "redirect:/usuarios/";
    }
    
    @GetMapping("/inicio")
    public String listarUsuarios(Model model) {
        model.addAttribute("usuarios", usuarioServicio.obtenerTodosLosUsuarios());
        return "inicio";
    }

    @GetMapping("/bloquear/{id}/{estado}")
    public String eliminarUsuario(@PathVariable Long id, @PathVariable int estado) {
        usuarioServicio.bloquearUsuario(id, estado);
        return "redirect:/usuarios/inicio";
    }
}

