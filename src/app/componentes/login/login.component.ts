import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import swall from 'sweetalert2'; // npm install sweetalert2 --save
import { UsuarioService } from '../dashboard/usuario/services/usuario.service';
import { LoginService } from './login.service';
import { SessionService } from './session.service';
import { Usuario } from './model/usuario-logeo';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;
  usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servicioLogin: LoginService,
    private tokenService: TokenService,
    private servicioSession: SessionService
  ) {
    this.formulario = this.fb.group({
      usuario: ['admin@gmail.com', Validators.required],
      password: ['admin', Validators.required],
    });
  }

  ngOnInit(): void {}

  ingresar() {
    const correo = this.formulario.value.usuario;
    const contrasena = this.formulario.value.password;

    this.servicioLogin.validarInicioSesion(correo, contrasena).subscribe({
      next: (usuario: Usuario) => {
        this.servicioSession.setUsuarioLogeado(usuario);
        this.servicioSession.setRolNombre(usuario.tipoUsuario);
        this.servicioSession.setUsuarioNombre(usuario.nombreUsuario);

        this.tokenService.setToken(usuario.contrasena!);
        this.tokenService.setUserName(usuario.nombreUsuario!);
        this.tokenService.setAuthorities([usuario.tipoUsuario]!);
       
        swall.fire({
          html: `<strong>${usuario.nombreUsuario.toLowerCase()}</strong> Iniciaste sesión como: <strong>${usuario.tipoUsuario.toUpperCase()}</strong>`,
          icon: 'success',
          confirmButtonColor: '#0275d8',
        });
        this.router.navigate(['dashboard']);
      },
      error: (error: any) => {
        swall.fire({
          html: 'Error al iniciar sesión',
          icon: 'error',
          confirmButtonColor: '#d80227',
        });
      },
    });
  }

  setServicioRol(rol: any) {
    // swall.fire({
    //   html: `${this.usuario.nombres.toUpperCase()} ${
    //     this.usuario.apellidos
    //   } Iniciastes sesión como: <strong>${rol}</strong>`,
    //   confirmButtonColor: '#0275d8',
    // });
    // this.servicio.setRolSesion(rol).subscribe({
    //   next: (res) => {
    //     localStorage.setItem('rol', JSON.stringify(res));
    //   },
    // });
    // this.router.navigate(['dashboard']);
  }
}
