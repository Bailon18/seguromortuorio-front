import { Component, OnInit, ViewChild } from '@angular/core';
import { Aportacion } from '../../model/aportaciones';
import { AportacionService } from '../../services/aportaciones.service';
import { Socio } from '../../../afiliados/model/socio';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DetallePdfComponent } from '../detalle-pdf/detalle-pdf.component';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable'; 

@Component({
  selector: 'app-pagos-reporte',
  templateUrl: './pagos-reporte.component.html',
  styleUrls: ['./pagos-reporte.component.css']
})
export class PagosReporteComponent implements OnInit {


  costoTotal: number;
  nombresocio: string = "";
  aportaciones : Aportacion[];
  fechaInicio: Date;
  fechaFin: Date;
  sugerencias: Socio[] = [];
  reportForm: FormGroup;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['FECHAPAGO', 'SOCIO', 'MESPAGO', 'TOTALCUOTA', 'ACCIONES'];
  dataSource = new MatTableDataSource<Aportacion>;

  constructor(
    private aportacionServicio: AportacionService,
    private formbuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.reportForm = this.formbuilder.group({
      fechainicio: ['', Validators.required], 
      fechafinal: ['', Validators.required],
      checktodos: [false],
      campoBusqueda: ['', Validators.required],
      idSocio: [''],
    });

  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Paginas';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Atras';
    this.dataSource.paginator = this.paginator;
  }


  getMonthName(date: any): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return monthNames[parsedDate.getMonth()];
    } else {
      return '';
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  generatePDF(){

    console.log("TOTAL ", this.aportaciones)

    const doc = new jsPDF();
  
    doc.setFontSize(17);

    doc.text('Reporte de Aportaciones', 15, 15);
  
    const headers = ['Fecha de Pago', 'Socio', 'Método de Pago', 'Mes de Pago', 'Total Cuota'];
    const data = this.aportaciones.map(aportacion => [
      new Date(aportacion.fechaAportacion).toLocaleDateString(),
      aportacion.socio.nombre + ' ' +aportacion.socio.apellido,
      aportacion.metodoPago,
      this.getMonthName(aportacion.fechaAportacion),
      '$.' + (aportacion.cuotasFinados + aportacion.otrasAportaciones).toFixed(2)
    ]);
  
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      headStyles: { fillColor: [47, 64, 83] }
    });
  
    const space = 15;
    const startYText = 25 + data.length * 10 + space;
  
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      headStyles: { fillColor: [47, 64, 83] }
    });

    const aportacionesAnio = this.costoTotal.toFixed(2);

    doc.setFontSize(11);
    doc.text(`Aportaciones: $ ${aportacionesAnio}`, 15, startYText);
    doc.save(`Reporte-Aportaciones.pdf`);
  }

  isValidField(field: string): boolean | null {
    return (
      this.reportForm.controls[field].errors &&
      this.reportForm.controls[field].touched
    );
  }


  getFieldError(field: string): string | null {
    if (!this.reportForm.controls[field]) return null;

    const errors = this.reportForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${field} es requerido`;
        case 'socioNotEncontrado':
          return `No se encontro socio`;
        
      }
    }
    return null;
  }

  buscarSocio(event: any) {
    const campoBusqueda = this.reportForm.get('campoBusqueda')?.value;

    this.aportacionServicio.buscarSocio(campoBusqueda).subscribe(socios => {
      if(socios.length > 0){
        this.sugerencias = socios;
      }else{
        this.reportForm.controls['campoBusqueda'].setErrors({ socioNotEncontrado: true });
      }
    });
    this.validarcampobusqueda()
  }

  validarcampobusqueda(){
    this.reportForm.get('checktodos')?.setValue(false);
  }

  validarcampocheck(): void {
    
    this.reportForm.get('campoBusqueda')?.setValue('');

    const isChecked = this.reportForm.get('checktodos')?.value;
    if (!isChecked) {
      this.reportForm.get('campoBusqueda')?.setValidators(Validators.required);
      this.reportForm.get('campoBusqueda')?.updateValueAndValidity();
    }else{
      this.reportForm.get('campoBusqueda')?.setErrors(null);

    }
  }

  seleccionarSugerencia(socio: Socio) {
    this.reportForm.patchValue({
      campoBusqueda: `${socio.nombre} ${socio.apellido}`,
      cuotas: socio.cuotas,
      idSocio: socio.id
    });
    this.validarcampobusqueda()
  }

  buscarconsulta() {
    const campoBusqueda = this.reportForm.get('campoBusqueda')?.value;
    const fechaInicio = this.reportForm.get('fechainicio')?.value;
    const fechaFinal = this.reportForm.get('fechafinal')?.value;
  
    if (campoBusqueda && fechaInicio && fechaFinal) {
      this.aportacionServicio.getAportaciones().subscribe((res: Aportacion[]) => {
        console.log("aportaciones", res);
        
        this.aportaciones = res.filter(aportacion => {
          return (
            aportacion.socio.id === parseInt(this.reportForm.get('idSocio')?.value) &&
            new Date(aportacion.fechaAportacion) >= fechaInicio &&
            new Date(aportacion.fechaAportacion) <= fechaFinal
          );
        });

        const sumaCuotasFinados = this.aportaciones.reduce((total, aportacion) => total + aportacion.cuotasFinados, 0);
        const sumaOtrasAportaciones = this.aportaciones.reduce((total, aportacion) => total + aportacion.otrasAportaciones, 0);

        this.costoTotal = sumaCuotasFinados + sumaOtrasAportaciones;

        this.dataSource = new MatTableDataSource(this.aportaciones);
        this.dataSource.paginator = this.paginator;
      });
    } else if (fechaInicio && fechaFinal) {
      this.aportacionServicio.getAportaciones().subscribe((res: Aportacion[]) => {
 
        this.aportaciones = res.filter(aportacion => {
          return (
            new Date(aportacion.fechaAportacion) >= fechaInicio &&
            new Date(aportacion.fechaAportacion) <= fechaFinal
          );
        });

        const sumaCuotasFinados = this.aportaciones.reduce((total, aportacion) => total + aportacion.cuotasFinados, 0);
        const sumaOtrasAportaciones = this.aportaciones.reduce((total, aportacion) => total + aportacion.otrasAportaciones, 0);

        this.costoTotal = sumaCuotasFinados + sumaOtrasAportaciones;

        this.dataSource = new MatTableDataSource(this.aportaciones);
        this.dataSource.paginator = this.paginator;

      });
    } else {
      this.listarAportaciones();
    }
  }
  
  listarAportaciones() {
    this.aportacionServicio.getAportaciones().subscribe((aportaciones: Aportacion[]) => {
      this.aportaciones = aportaciones;
      this.dataSource = new MatTableDataSource(aportaciones);
      this.dataSource.paginator = this.paginator;
      console.log("aportaciones", this.aportaciones);
    });
  }
  
  abrirDialogoPdfDettale(fila: any){
    this.dialog.open(DetallePdfComponent, {
      width:'700px',
      data:fila
      }).afterClosed().subscribe(valor =>{
    });
  }

  
  
}
