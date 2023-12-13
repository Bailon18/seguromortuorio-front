
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Aportacion } from '../../../pagos/model/aportaciones';
import { AfiliadosService } from '../../services/afiliados.service';
import * as html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable'; 


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

  getMonthName(date: any): string {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return monthNames[parsedDate.getMonth()];
    } else {
      return ''; // O devuelve un valor por defecto o maneja el error según tu lógica
    }
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


 
  generatePDF(): void {

    const doc = new jsPDF();
  
    doc.setFontSize(17);
    doc.text('Listado de Aportaciones', 15, 15);
  
    const headers = ['Fecha de Pago', 'Método de Pago', 'Mes de Pago', 'Total Cuota'];
    const data = this.aportacionessocio.map(aportacion => [
      new Date(aportacion.fechaAportacion).toLocaleDateString(),
      aportacion.metodoPago,
      this.getMonthName(aportacion.fechaAportacion), // esto me sale Undefined!
      '$.' + (aportacion.cuotasFinados + aportacion.otrasAportaciones).toFixed(2) 
    ]);
  
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      headStyles: { fillColor: [47, 64, 83] }
    });
  
    const space = 3; 
    const startYText = 25 + data.length * 10 + space; 
  
    const aportacionesAnio = this.costoTotal.toFixed(2);
  
    doc.setFontSize(11);
    doc.text(`Aportaciones del año: ${this.selectedYear}: $ `, 15, startYText + space);
    doc.text(aportacionesAnio, 75, startYText + space);
  
    doc.save(`Reporte-${this.nombresocio}.pdf`);
  }

}
