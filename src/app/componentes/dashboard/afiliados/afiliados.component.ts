import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Afiliacion } from '../citas/model/afiliacion';
import { Socio } from './model/socio';
import { AfiliadosService } from './services/afiliados.service';

@Component({
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.css']
})
export class AfiliadosComponent implements AfterViewInit , OnInit {

  estadoFiltro:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'FECHA DE INSCRIPCION',  'NOMBRE', 'APELLIDOS', 'DOCUMENTO IDENTIDAD', 'TELEFONO','ACCIONES'];
  dataSource = new MatTableDataSource<Socio>;

  constructor(
    private servicioAfiliacion: AfiliadosService,
  ) { }

  ngOnInit(): void {
    this.listarAfiliaciones();
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

  listarAfiliaciones(){
    return this.servicioAfiliacion.getAfiliaciones().subscribe({
      next: res => {
        console.log(res)
        let filtrado = res.filter(u => u.activo == true)
        this.dataSource = new MatTableDataSource(filtrado)
        this.dataSource.paginator = this.paginator;
        },
      error: error => {
        console.log("Ocurrio un error en la carga")
      }
      }
    )
  }

  mostrarInactivos(){

  }

  abrirDialogoNuevoAfiliado(){

  }

  editarAfiliado(fila: any){

  }

  bloquearAfiliado(fila: any){

  }
}
