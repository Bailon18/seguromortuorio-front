
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

  costoTotal: number;
  nombresocio: string = "";
  aportacionessocio : Aportacion[];
  fechaInicio: Date;
  fechaFin: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
  ) { }

  ngOnInit(): void {

    this.nombresocio = this.datoedit.nombre
  }

  buscarAportacionesPorFecha(): void {
    if (this.fechaInicio && this.fechaFin) {
      const formattedStartDate = this.formatDate(this.fechaInicio);
      const formattedEndDate = this.formatDate(this.fechaFin);
      
      this.afiliacionServicio.getAportacionesPorFechaYSocio(this.datoedit.id, formattedStartDate, formattedEndDate)
        .subscribe({
          next: (aportaciones) => {
            this.aportacionessocio = aportaciones;

            const sumaCuotasFinados = this.aportacionessocio.reduce((total, aportacion) => total + aportacion.cuotasFinados, 0);
            const sumaOtrasAportaciones = this.aportacionessocio.reduce((total, aportacion) => total + aportacion.otrasAportaciones, 0);

            this.costoTotal = sumaCuotasFinados + sumaOtrasAportaciones;
          },
          error: (err) => {
          }
        });
    } else {
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
      return '';
    }
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  generatePDF(): void {
    const doc = new jsPDF();
  
    doc.setFontSize(17);
    doc.text('Listado de Aportaciones', 15, 15);
  
    const headers = ['Fecha de Pago', 'Método de Pago', 'Mes de Pago', 'Total Cuota'];
    const data = this.aportacionessocio.map(aportacion => [
      new Date(aportacion.fechaAportacion).toLocaleDateString(),
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
    doc.text(`Aportaciones de ${this.formatDate(this.fechaInicio)} a ${this.formatDate(this.fechaFin)}: $ ${aportacionesAnio}`, 15, startYText);
    doc.save(`Reporte-Aportaciones-${this.nombresocio}.pdf`);
  }
  

}
