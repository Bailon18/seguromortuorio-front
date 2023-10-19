import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Roles, Usuario } from '../model/usuario';
import swall from 'sweetalert2';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  usuarioForm: FormGroup
  titulo: string = "Nuevo Usuario";
  tituloBoton:string ="Guardar"
 
  constructor(private formbuilder: FormBuilder, 
            private servicio: UsuarioService,
            @Inject(MAT_DIALOG_DATA) public datoedit : any,
            private dialog : MatDialogRef<CrearComponent>)
          {}

  ngOnInit(): void {

   
    this.usuarioForm = this.formbuilder.group({
      id: [''],
      nombreUsuario: ['', Validators.required],
      contrasena: ['',[Validators.required, Validators.minLength(5)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      activo: [true, Validators.required],
      tipoUsuario: ['ADMINISTRADOR']
    })


    if(this.datoedit){

      this.servicio.buscarUsuario(this.datoedit.id).subscribe(u => 
        {
          this.usuarioForm.controls['id'].setValue(u.id)
          this.usuarioForm.controls['nombreUsuario'].setValue(u.nombreUsuario);
          this.usuarioForm.controls['contrasena'].setValue(u.contrasena);
          this.usuarioForm.controls['correoElectronico'].setValue(u.correoElectronico);
          this.usuarioForm.controls['activo'].setValue(u.activo);
          this.usuarioForm.controls['tipoUsuario'].setValue(u.tipoUsuario);
        })

      this.titulo = "Editar Usuario";
      this.tituloBoton = "Actualizar";

    }
  }





  guardarUsuario(){

    if(!this.datoedit){
    
        if(this.usuarioForm.valid){
    
          this.servicio.guardarUsuarioServi(this.usuarioForm.value).subscribe( usu => {
              this.dialog.close("guardar")
              swall.fire({
                icon: 'success',
                confirmButtonColor:'#0275d8',
                html:  `Se registro correctamente al usuario:  <strong>${this.usuarioForm.value['nombreUsuario']}</strong>`,
              })
          
            }
          )
        }
    }else{
      this.actualizarUsuario()
    }

  }

  actualizarUsuario(){
    
    this.servicio.guardarUsuarioServi(this.usuarioForm.value).subscribe(usuario => {
      this.dialog.close("actualizar");
      swall.fire({
        icon: 'success',
        confirmButtonColor:'#0275d8',
        html:  `Se actualizo correctamente al usuario:  <strong>${this.usuarioForm.value['nombreUsuario']}</strong>`,
      })

    })

  }

  validarcorreo(event:any){

    if (this.usuarioForm.controls['correoElectronico'].valid){
      
      const correo = (event.target as HTMLInputElement).value;

      this.servicio.validarcorreo(correo).subscribe(res => {
        if(res){
          this.usuarioForm.controls['correoElectronico'].setErrors({ invalid: 'Correo ya esta registrado' });
        }else{
          this.usuarioForm.controls['correoElectronico'].setErrors(null);
        }
      })

    }
  }
}
