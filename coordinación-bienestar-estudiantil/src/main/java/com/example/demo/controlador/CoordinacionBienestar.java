package com.example.demo.controlador;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.model.entidad.CoordinacionBienestarEstudiantil;
import com.example.demo.model.entidad.TipoConsulta;
import com.example.demo.model.entidad.Usuario;
import com.example.demo.model.entidad.servicios.CoordinacionBienestarEstudiantilService;
import com.example.demo.model.entidad.servicios.TipoConsultaService;
import com.example.demo.model.entidad.servicios.UsuarioServicio;

@Controller
@RequestMapping("/coordinacion")
public class CoordinacionBienestar {

	@Autowired
    private  CoordinacionBienestarEstudiantilService coordinacionService;
	
    @Autowired
    private UsuarioServicio usuarioServicio;
    
    @Autowired
    private TipoConsultaService tipoConsultaService;

    @GetMapping("/nuevo/{usuarioId}")
    public String mostrarFormularioNuevaCoordinacion(@PathVariable Long usuarioId, Model model) {

        CoordinacionBienestarEstudiantil coordinacion = new CoordinacionBienestarEstudiantil();
        Usuario usuario = usuarioServicio.obtenerUsuarioPorId(usuarioId);
        coordinacion.setUsuario(usuario);

        model.addAttribute("coordinacion", coordinacion);
        model.addAttribute("nombreUsuario", usuario.getNombre() +" "+ usuario.getApellido());
        model.addAttribute("usuarioid", usuario.getId());

        return "coordinacion/nuevo";
    }


    @RequestMapping(value = "/nuevo", headers = "content-type=multipart/*", method = RequestMethod.POST)
    public String guardarNuevaCoordinacion(@ModelAttribute CoordinacionBienestarEstudiantil coordinacion
            ,@RequestParam("usuarioid") Long usuarioId,
            @RequestParam("tipoConsultaid") Long tipoConsultaid,
            Model model
            ) {

    	TipoConsulta tipoConsulta = tipoConsultaService.obtenerPorId(tipoConsultaid);
        coordinacion.setTipoConsulta(tipoConsulta);
        
        Usuario usuario = usuarioServicio.obtenerUsuarioPorId(usuarioId);
        coordinacion.setUsuario(usuario);
        
        coordinacionService.agregarCoordinacion(coordinacion);
        List<CoordinacionBienestarEstudiantil> listadocor = coordinacionService.obtenerTodasLasCoordinaciones();
        model.addAttribute("coordinaciones", listadocor);
       
        return "coordinacion/listado";
    }
    
    @GetMapping("/listado")
    public String listado(Model model) {

        List<CoordinacionBienestarEstudiantil> listadocor = coordinacionService.obtenerTodasLasCoordinaciones();
        model.addAttribute("coordinaciones", listadocor);
       
        return "coordinacion/listado";
    }


}
