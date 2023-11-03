
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Aportacion } from '../../../pagos/model/aportaciones';
import { AfiliadosService } from '../../services/afiliados.service';
import * as html2pdf from 'html2pdf.js';

@Component({
  templateUrl: './reporte-aportaciones.component.html',
  styleUrls: ['./reporte-aportaciones.component.css']
})
export class ReporteAportacionesComponent implements OnInit {

  selectedYear: number; 
  costoTotal: number;
  ahoaportacion:number[] = [];
  nombresocio: string = "";
  fechaactual: Date  = new Date();
  aportacionessocio : Aportacion[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
  ) { }

  ngOnInit(): void {
    this.nombresocio = this.datoedit.nombre + ' ' + this.datoedit.apellido; 
    this.afiliacionServicio.getAportacionAhoSocio(this.datoedit.id).subscribe({
      next:(res) =>{
        this.ahoaportacion = res;
        if (this.ahoaportacion && this.ahoaportacion.length > 0) {
          this.selectedYear = this.ahoaportacion[0];
          this.cargarAportacionesPorAnioYIdSocio(this.selectedYear, this.datoedit.id)
        }
      },
      error:(err) =>{

      }
    })
  }

  buscarAportacionesPorAnio(aho: number): void {
    this.selectedYear = aho
    if (this.selectedYear) {
      this.cargarAportacionesPorAnioYIdSocio(this.selectedYear, this.datoedit.id)
    }
  }

  getMonthName(month: any): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return monthNames[month - 1];
  }
  

  cargarAportacionesPorAnioYIdSocio(year: number, socioId: number) {
    this.afiliacionServicio.getAportacionesPorAnioYIdSocio(year, socioId).subscribe({
      next: (aportaciones) => {
        this.aportacionessocio = aportaciones;

        const sumaCuotasFinados = this.aportacionessocio.reduce((total, aportacion) => total + aportacion.cuotasFinados, 0);
        const sumaOtrasAportaciones = this.aportacionessocio.reduce((total, aportacion) => total + aportacion.otrasAportaciones, 0);

        // Suma total
        this.costoTotal = sumaCuotasFinados + sumaOtrasAportaciones;
      },
      error: (err) => {
      }
    });
  }

  descargarBoleta(event: any) {

    event.preventDefault();

    const options = {
      margin: 10,
      filename: 'Reporte-'+this.nombresocio+'.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const element = document.getElementById('cuerpoboleta');

    html2pdf()
      .from(element)
      .set(options)
      .save();
  }

}
