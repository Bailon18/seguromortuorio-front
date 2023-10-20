import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swall from 'sweetalert2';
import { AfiliadosService } from '../../services/afiliados.service';
import { Socio } from '../../model/socio';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  templateUrl: './crear-socio.component.html',
  styleUrls: ['./crear-socio.component.css']
})
export class CrearSocioComponent implements OnInit {

  socioForm: FormGroup;
  titulo: string = "Nuevo Socio";
  tituloBoton:string ="Guardar"
  selectedFile?:  null;
  nuevosocio?: Socio;
  modoCrear:boolean = true
  
  @ViewChild('imagenInputFile', { static: false }) imagenInputFile?: ElementRef;

  constructor(
    private formbuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
    private dialog : MatDialogRef<CrearSocioComponent>
  ) { }

  ngOnInit(): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18); 

    this.socioForm = this.formbuilder.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documentoIdentidad: ['', Validators.required],
      fechaNacimiento: [today, [Validators.required, this.validarEdad(18)]],
      edad: [18],
      direccion: [''],
      telefono: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['fondomortuorio23', [Validators.required, Validators.minLength(5)]],
      FechaInscripcion: [null],
      activo: [true, Validators.required],
      archivo: [ '', Validators.required ]
    });

    if(this.datoedit){
      this.afiliacionServicio.buscarAfiliacion(this.datoedit.id).subscribe(u => {
        this.socioForm.patchValue({
          id: u.id,
          nombre: u.nombre,
          apellido: u.apellido,
          documentoIdentidad: u.documentoIdentidad,
          fechaNacimiento: new Date(u.fechaNacimiento),
          edad: u.edad,
          direccion: u.direccion,
          telefono: u.telefono,
          correoElectronico: u.correoElectronico,
          contrasena: u.contrasena,
          FechaInscripcion: new Date(u.fechaInscripcion),
          activo: u.activo,
          archivo: u.archivo
        });

      });

      this.modoCrear = false;
      this.titulo = "Editar Socio";
      this.tituloBoton = "Actualizar";
    }


    
    
    
  }

  guardarSocio(){
    if(!this.datoedit){
      
      if(this.socioForm.valid){

        const formData = new FormData();

        const nuevoSocio: Socio = {
          nombre: this.socioForm.value.nombre,
          apellido: this.socioForm.value.apellido,
          documentoIdentidad: this.socioForm.value.documentoIdentidad,
          fechaNacimiento: this.socioForm.value.fechaNacimiento,
          edad: this.socioForm.value.edad,
          direccion: this.socioForm.value.direccion,
          telefono: this.socioForm.value.telefono,
          correoElectronico: this.socioForm.value.correoElectronico,
          contrasena: this.socioForm.value.contrasena,
          fechaInscripcion: this.socioForm.value.FechaInscripcion,
          activo: this.socioForm.value.activo,
        };


        formData.append(
          'socio',
          new Blob([JSON.stringify(nuevoSocio)], { type: 'application/json' }));
  
        if (this.selectedFile) {
          formData.append('archivo', this.selectedFile);
        }

        this.afiliacionServicio.guardarAfiliacion(formData).subscribe( usu => {
            this.dialog.close("guardar")
            swall.fire({
              icon: 'success',
              confirmButtonColor:'#0275d8',
              html:  `Se registro correctamente la afiliacion al socio:  <strong>${this.socioForm.value['nombre']}</strong>`,
            })
        
          }
        )
      }
    }
  }

  validarEdad(edadMinima: number) {
    return (control: { value: Date }) => {
      const fechaNacimiento = control.value;
      const today = new Date();
      const edad = today.getFullYear() - fechaNacimiento.getFullYear();
      return edad >= edadMinima ? null : { edadInvalida: true };
    };
  }

  onFileSelected(event: any) {
    try {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    } catch (error) {
      console.error("Error al seleccionar el archivo:", error);
    }
  }
  
  actualizarEdad(event: any) {
    console.log("sdjksjs")
    const selectedDate = event.value;
    if (selectedDate) {

      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      console.log(age)
      
      this.socioForm.get('edad')?.setValue(age);
    }
  }

  verVistaPrevia() {
    const archivo = this.socioForm.get('archivo')?.value;
    if (archivo) {
      const byteCharacters = atob(archivo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const archivoBlob = new Blob([byteArray], { type: 'application/pdf' });
  
      const archivoUrl = window.URL.createObjectURL(archivoBlob);
  
      // Abre una nueva ventana o pestaña para mostrar la vista previa del archivo
      window.open(archivoUrl, '_blank');
    }
  }
  
  descargarArchivo() {
    const archivo = this.socioForm.get('archivo')?.value;
    if (archivo) {
      const byteCharacters = atob(archivo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const archivoBlob = new Blob([byteArray], { type: 'application/pdf' });
  
      const url = window.URL.createObjectURL(archivoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download ='documento-' + this.socioForm.value.nombre + '.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
  
  
  
  
  

}