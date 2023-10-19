import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { SessionService } from '../../login/session.service';
import { Usuario } from '../../login/model/usuario-logeo';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] 
})
export class NavbarComponent implements OnInit {

  usuario: Usuario;
  rolInicioSesion:string;

  constructor(
    private servicio: LoginService,
    public servicioSession: SessionService
    ) { }

  ngOnInit(): void {

    this.usuario = this.servicioSession.getUsuarioLogeado();
    console.log(this.usuario)
    // this.servicio.getObtenerUsuario().subscribe({
    // next:(res) => {
    //   // this.usuario = res;
    //   // this.roles = this.usuario.roles[0];
    //   this.usuario = JSON.parse(localStorage.getItem('usuario')!) || [];
    // }
    // })


    // this.servicio.getObtenerRolSesion().subscribe({
    //   next:(res) => {

    //     this.rolInicioSesion = JSON.parse(localStorage.getItem('rol')!) || [];

    //     //this.rolInicioSesion = res;
    //     console.log("ROL DE INICIO FUE  ", this.rolInicioSesion)
    //   }
    // })
    //this.rolInicioSesion = "Administrador"
  }

}
