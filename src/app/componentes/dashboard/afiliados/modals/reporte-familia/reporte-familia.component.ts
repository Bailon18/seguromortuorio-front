import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';
import { AfiliadosService } from '../../services/afiliados.service';
import { Familiar } from '../../model/familia';

@Component({
  templateUrl: './reporte-familia.component.html',
  styleUrls: ['./reporte-familia.component.css']
})
export class ReporteFamiliaComponent implements OnInit {

  familiares: Familiar[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
    private dialog : MatDialogRef<ReporteFamiliaComponent>
  ) { }


  ngOnInit(): void {
    this.listarFamiliares()
  }


  exportarAPdf() {
      const options = {
          margin: 10,
          filename: 'ListaFamiliares.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const element = document.getElementById('tabla-familiares'); // Agrega un ID a tu tabla

      html2pdf()
          .from(element)
          .set(options)
          .save();
  }

  listarFamiliares(){
    return this.afiliacionServicio.obtenerFamiliaresPorSocioId(this.datoedit.id).subscribe({
      next: res => {
        this.familiares = res;
        },
      error: error => {
        console.log("Ocurrio un error en la carga")
      }
      }
    )
  }


 }
