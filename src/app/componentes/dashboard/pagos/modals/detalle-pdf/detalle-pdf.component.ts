import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Aportacion } from '../../model/aportaciones';
import * as html2pdf from 'html2pdf.js';

@Component({
  templateUrl: './detalle-pdf.component.html',
  styleUrls: ['./detalle-pdf.component.css']
})
export class DetallePdfComponent implements OnInit {

  pago: Aportacion = new Aportacion();

  constructor(
    @Inject(MAT_DIALOG_DATA) public datoedit: any
  ) {}

  ngOnInit(): void {
    if (this.datoedit != null) {
      this.pago = this.datoedit;
    }
  }

  descargarBoleta(event: any) {

    event.preventDefault();

    const options = {
      margin: 10,
      filename: 'BoletaElectronica-'+this.datoedit.socio.nombre +'-'+ this.datoedit.socio.apellido+'.pdf',
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
