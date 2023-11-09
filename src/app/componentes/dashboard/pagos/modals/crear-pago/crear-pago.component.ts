import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Aportacion } from '../../model/aportaciones';
import { AportacionService } from '../../services/aportaciones.service';
import { Socio } from '../../../afiliados/model/socio';
import { SessionService } from 'src/app/componentes/login/session.service';
import { Usuario } from '../../../usuario/model/usuario';
import swall from 'sweetalert2';

@Component({
  templateUrl: './crear-pago.component.html',
  styleUrls: ['./crear-pago.component.css']
})
export class CrearPagoComponent implements OnInit {

  aportacionForm: FormGroup;
  titulo: string = "Nuevo Pago";
  tituloBoton:string ="Guardar"
  nuevopago?: Aportacion;
  modoCrear:boolean = true
  sugerencias: Socio[] = [];

  constructor(
    private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private aportacionServicio: AportacionService,
    public servicioSession: SessionService,
    private dialog : MatDialogRef<CrearPagoComponent>
  ) { }

  ngOnInit(): void {

    this.aportacionForm = this.formbuilder.group({
      id: [''],
      fechaAportacion: [new Date(), Validators.required],
      cuotas: [0, Validators.required],
      cuotasFinados: [5, [Validators.required, Validators.min(5)]],
      otrasAportaciones: [5, [Validators.required, Validators.min(5)]],
      descripcion: [''],
      metodoPago: ['', Validators.required],
      numeroTransaccion: [''],
      estadoPago: ['PAGADO', Validators.required],
      campoBusqueda: ['', Validators.required],
      idSocio: ['', Validators.required],
    });
  
    
    this.aportacionForm.get('cuotasFinados')?.setValue(this.formatCurrency(this.aportacionForm.get('cuotas')?.value));
    this.aportacionForm.get('otrasAportaciones')?.setValue(this.formatCurrency(5));

    this.aportacionForm.get('cuotas')?.valueChanges.subscribe(() => {

      const cuotasValue = parseFloat(String(this.aportacionForm.get('cuotas')?.value).replace('$', '').replace(',', ''));

      this.aportacionForm.get('cuotasFinados')?.setValidators([Validators.required, Validators.min(cuotasValue)]);
      this.aportacionForm.get('cuotasFinados')?.updateValueAndValidity();
  });
    

  
    if(this.datoedit){
      this.aportacionServicio.buscarAportacion(this.datoedit.id).subscribe(u => {
        this.aportacionForm.patchValue({
          id: u.id,
          fechaAportacion: u.fechaAportacion,
          cuotas:this.formatCurrency(u.cuotas),
          cuotasFinados: this.formatCurrency(u.cuotasFinados),
          otrasAportaciones: this.formatCurrency(u.otrasAportaciones),
          descripcion: u.descripcion,
          metodoPago: u.metodoPago,
          numeroTransaccion: u.numeroTransaccion,
          estadoPago: u.estadoPago,
          campoBusqueda: u.socio.nombre + " " + u.socio.apellido,
          idSocio: u.socio.id,
        });
      });

      this.seleccionarSugerencia(this.datoedit.socio);
      this.modoCrear = false;
      this.titulo = "Editar Pago";
      this.tituloBoton = "Actualizar";
      this.aportacionForm.get('cuotas')?.disable(); // Deshabilita el campo cuotasFinados
      this.aportacionForm.get('campoBusqueda')?.disable(); // Deshabilita el campo cuotasFinados
      this.onMetodoPagoChange();
    }
  }

  isValidField(field: string): boolean | null {
    return (
      this.aportacionForm.controls[field].errors &&
      this.aportacionForm.controls[field].touched
    );
  }

  cuotasFinadosValidator(control: FormControl) {
    const cuotasValue = parseFloat(this.aportacionForm.get('cuotas')?.value.replace('$', '').replace(',', ''));
    const cuotasFinadosValue = parseFloat(control.value.replace('$', '').replace(',', ''));

    if (cuotasValue && cuotasFinadosValue && cuotasFinadosValue < cuotasValue) {
        return { cuotasFinadosMenor: true };
    }

    return null;
}


  getFieldError(field: string): string | null {
    if (!this.aportacionForm.controls[field]) return null;

    const errors = this.aportacionForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;
        case 'socioNotEncontrado':
          return `No se encontro socio`;
        case 'min':
          return `Mayor a 6 dolares`;
        case 'cuotasFinadosMenor':
          return `Cuotas Finados no puede ser menor que Cuotas`;
      }
    }
    return null;
  }




  formatCurrency(value: number | string): string {

    if (!isNaN(Number(value))) {
      return '$ ' + Number(value).toFixed(2); 
    }
   
    return value.toString();
  }

  onInputCuotasFinados(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = this.formatCurrency(inputElement.value);
  }

  onInputOtrasAportaciones(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = this.formatCurrency(inputElement.value);
  }


  guardarPago() {

    if (this.aportacionForm.valid) {

      let socio: Socio = new Socio();
      socio.id = this.aportacionForm.get('idSocio')?.value;

      let usuario: Usuario = new Usuario()
      usuario.id = 2
   
      const cuotasFinados = parseFloat(this.aportacionForm.get('cuotasFinados')?.value.replace('$', '').replace(',', ''));
      const otrasAportaciones = parseFloat(this.aportacionForm.get('otrasAportaciones')?.value.replace('$', '').replace(',', ''));
      const cuotas = parseFloat(this.formatCurrency(this.aportacionForm.get('cuotas')?.value).replace('$', '').replace(',', ''));
    
      const pago: Aportacion = {
        fechaAportacion: this.aportacionForm.get('fechaAportacion')?.value,
        cuotas: cuotas,
        cuotasFinados: cuotasFinados,
        otrasAportaciones: otrasAportaciones,
        descripcion: this.aportacionForm.get('descripcion')?.value,
        metodoPago: this.aportacionForm.get('metodoPago')?.value,
        numeroTransaccion: this.aportacionForm.get('numeroTransaccion')?.value,
        estadoPago: this.aportacionForm.get('estadoPago')?.value,
        socio:  socio,
        tesorero: usuario
      };
      
      if(this.datoedit){
        pago.id = this.datoedit.id
        this.aportacionServicio.guardarAportacion(pago).subscribe(
          (resultado) => {
            swall.fire({
              icon: 'success',
              confirmButtonColor:'#0275d8',
              html:  `Se actualizo correctamente el pago`,
            })
            this.dialog.close();
          },
          (error) => {
            console.error('Error al guardar la aportación', error);
          }
        );
      }
      else{
        this.aportacionServicio.guardarAportacion(pago).subscribe(
          (resultado) => {
            swall.fire({
              icon: 'success',
              confirmButtonColor:'#0275d8',
              html:  `Se registro correctamente el pago`,
            })
            this.dialog.close();
          },
          (error) => {
            console.error('Error al guardar la aportación', error);
          }
        );
      }
    
    }
  }
  

  buscarSocio(event: any) {
    const campoBusqueda = this.aportacionForm.get('campoBusqueda')?.value;
    this.aportacionServicio.buscarSocio(campoBusqueda).subscribe(socios => {
      if(socios.length > 0){
        this.sugerencias = socios;
      }else{
        this.aportacionForm.controls['campoBusqueda'].setErrors({ socioNotEncontrado: true });
      }
    });
  }
  

  seleccionarSugerencia(socio: Socio) {
    this.aportacionForm.patchValue({
      campoBusqueda: `${socio.nombre} ${socio.apellido}`,
      cuotas: socio.cuotas,
      cuotasFinados: this.formatCurrency(socio.cuotas),
      idSocio: socio.id
    });
  }
  

  onMetodoPagoChange() {
    const numeroTransaccionControl = this.aportacionForm.get('numeroTransaccion');
    
    if (this.isTransferenciaBancaria) {
      numeroTransaccionControl?.setValidators(Validators.required);
      numeroTransaccionControl?.enable();
    } else {
      numeroTransaccionControl?.clearValidators();
      numeroTransaccionControl?.disable();
    }
    
    numeroTransaccionControl?.updateValueAndValidity();
  }
  

  get isTransferenciaBancaria() {
    return this.aportacionForm.get('metodoPago')?.value === 'TRANSFERENCIA_BANCARIA';
  }
  

  
  
  
}
