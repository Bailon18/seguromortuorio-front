import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Familiar } from '../../model/familia';
import { AfiliadosService } from '../../services/afiliados.service';
import { MatTabGroup } from '@angular/material/tabs';
import { Socio } from '../../model/socio';
import swall from 'sweetalert2';

@Component({
  templateUrl: './crear-familiar.component.html',
  styleUrls: ['./crear-familiar.component.css']
})
export class CrearFamiliarComponent implements AfterViewInit , OnInit{

  familiaForm: FormGroup;
  titulo: string = "Nuevo Familia";
  tituloBoton:string ="Guardar"
  selectedFile: File | null | undefined = null;
  nuevofamilia?: Familiar;
  modoCrear:boolean = true

  estadoFiltro:any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['NOMBRE', 'CEDULA', 'PARENTESCO', 'ACCIONES'];
  dataSource = new MatTableDataSource<Familiar>;

  constructor(
    private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
    private dialog : MatDialogRef<CrearFamiliarComponent>
  ) { }

  ngOnInit(): void {

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);

    this.familiaForm = this.formbuilder.group({
      id:[''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documentoIdentidad: ['', Validators.required],
      tipoParentesco: ['Esposa(o)', Validators.required],
      fechaNacimiento: [today, [Validators.required]],
      edad: [18, Validators.required],
      direccion: [''],
      telefono: [''],
      archivo: [this.selectedFile, Validators.required],
    });

    this.listarFamiliares();
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listarFamiliares(){
    return this.afiliacionServicio.obtenerFamiliaresPorSocioId(this.datoedit.id).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        },
      error: error => {
        console.log("Ocurrio un error en la carga")
      }
      }
    )
  }

  resetearFormulario() {
    this.changeTab(0);
  }

  nuevoFamiliarForm(){
    this.changeTab(1)
    this.modoCrear = true;
    this.titulo = "Nuevo Familiar";
    this.tituloBoton = "Guardar";
  }

  changeTab(tabIndex: number) {
    this.familiaForm.reset();
    this.familiaForm.setValidators(null);
    this.listarFamiliares();
    //this.modoCrear = true;
    this.tabGroup.selectedIndex = tabIndex;
  }


  eliminarFamiliar(fila: any) {
    swall.fire({
      html: '¿Estás seguro de que deseas eliminar a este familiar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#d9534f',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.afiliacionServicio.eliminarFamiliar(fila.id).subscribe({
          next: () => {
            swall.fire({
              icon: 'success',
              confirmButtonColor: '#0275d8',
              html: 'Se eliminó correctamente el familiar.'
            });
            this.listarFamiliares();
          },
          error: (err) => {
            swall.fire({
              icon: 'error',
              confirmButtonColor: '#d9534f',
              html: `Error al realizar la acción: <strong>${err.message}</strong>`
            });
          }
        });
      }
    });
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

  verVistaPrevia() {
    const archivo = this.familiaForm.get('archivo')?.value;
    if (archivo) {
      const byteCharacters = atob(archivo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const archivoBlob = new Blob([byteArray], { type: 'application/pdf' });

      const archivoUrl = window.URL.createObjectURL(archivoBlob);

      window.open(archivoUrl, '_blank');
    }
  }

  descargarArchivo() {
    const archivo = this.familiaForm.get('archivo')?.value;
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
      a.download ='documento-' + this.familiaForm.value.nombre + '.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  guardarFamiliar(){

    let tipo = "registró"

    if(this.familiaForm.valid){

      const formData = new FormData();

      const socio = new Socio();
      socio.id = this.datoedit.id;

      const nuevoFamiliar: Familiar = {
        nombre: this.familiaForm.value.nombre,
        apellido: this.familiaForm.value.apellido,
        documentoIdentidad: this.familiaForm.value.documentoIdentidad,
        fechaNacimiento: this.familiaForm.value.fechaNacimiento,
        edad: this.familiaForm.value.edad,
        direccion: this.familiaForm.value.direccion,
        telefono: this.familiaForm.value.telefono,
        tipoParentesco: this.familiaForm.value.tipoParentesco,
        socio: socio
      };


      if(!this.modoCrear){
        nuevoFamiliar.id = this.datoedit.id;
        tipo = "actualizó";
      }

      console.log("nuevoFamiliar: ", nuevoFamiliar)

      formData.append(
        'familiar',
        new Blob([JSON.stringify(nuevoFamiliar)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }

      this.afiliacionServicio.guardarFamiliar(formData).subscribe(
        (usu) => {
          swall.fire({
            icon: 'success',
            confirmButtonColor: '#0275d8',
            html: `Se ${tipo} correctamente el familiar: <strong>${this.familiaForm.value['nombre']}</strong>`,
          });
          this.familiaForm.reset();
          this.changeTab(0);
        },
        (error) => {
          swall.fire({
            icon: 'error',
            confirmButtonColor: '#d9534f',
            html: `Error al realizar la accion: <strong>${error.message}</strong>`,
          });
        }
      );

    }

  }

  editarFamiliar(fila:any){

    this.modoCrear = false;
    this.titulo = "Editar Familiar";
    this.tituloBoton = "Actualizar";

    this.changeTab(1)

    console.log("ID: "+ fila.id)

    this.afiliacionServicio.buscarFamiliarId(fila.id).subscribe( res => {
      this.familiaForm.patchValue({
        id: res.id,
        nombre: res.nombre,
        apellido: res.apellido,
        documentoIdentidad: res.documentoIdentidad,
        fechaNacimiento: new Date(res.fechaNacimiento),
        edad: res.edad,
        direccion: res.direccion,
        telefono: res.telefono,
        tipoParentesco: res.tipoParentesco,
        archivo: res.archivo
      })

      if (res.archivo) {
        this.selectedFile = new File([res.archivo], 'archivo.pdf', { type: 'application/pdf' });
      }
    })

    
  }

  actualizarEdad(event: any) {

    const selectedDate = event.value;
    if (selectedDate) {

      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      console.log(age)

      this.familiaForm.get('edad')?.setValue(age);
    }
  }

  validardocumentoidentidad(event:any){

    if (this.familiaForm.controls['documentoIdentidad'].valid){

      const documentoIdentidad = (event.target as HTMLInputElement).value;

      this.afiliacionServicio.existsByDocumentoIdentidadFamiliar(documentoIdentidad).subscribe(res => {
        if(res){
          this.familiaForm.controls['documentoIdentidad'].setErrors({ documentoInvalid: true});
        }else{
          this.familiaForm.controls['documentoIdentidad'].setErrors(null);
        }
      })

    }
  }

  isValidField(field: string): boolean | null {
    return (
      this.familiaForm.controls[field].errors &&
      this.familiaForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.familiaForm.controls[field]) return null;

    const errors = this.familiaForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;
        
        case 'numeroInvalido':
          return `${field} tiene que ser númerico `;

        case 'minLength':
          return `${field} minímo 5 digitos`;

        case 'documentoInvalid':
          return `Cedula ya esta registrado`;

        case 'correoInvalid':
            return `Correo ya esta registrado`;
      }
    }
    return null;
  }
}
