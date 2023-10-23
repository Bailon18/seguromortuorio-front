import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Familiar } from '../../model/familia';
import { AfiliadosService } from '../../services/afiliados.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  templateUrl: './crear-familiar.component.html',
  styleUrls: ['./crear-familiar.component.css']
})
export class CrearFamiliarComponent implements OnInit {

  familiaForm: FormGroup;
  titulo: string = "Nuevo Familia";
  tituloBoton:string ="Guardar"
  selectedFile?:  null;
  nuevofamilia?: Familiar;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor(
    private formbuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public datoedit : any,
    private afiliacionServicio: AfiliadosService,
    private dialog : MatDialogRef<CrearFamiliarComponent>
  ) { }

  ngOnInit(): void {

      this.familiaForm = this.formbuilder.group({
        id:[''],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        documentoIdentidad: ['', Validators.required],
        tipoParentesco: ['', Validators.required],
        fechaNacimiento: ['', Validators.required],
        edad: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
        archivo: [''], 
      });

  }

  

  changeTab(index: number) {
    this.tabGroup.selectedIndex = index;
  }

}
