import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Aportacion } from './model/aportaciones';
import { AportacionService } from './services/aportaciones.service';

@Component({
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  estadoFiltro:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'SOCIO', 'FECHA PAGO',  'CUOTA', 'CUOTA FINADO', 'OTRAS APORTACIONES', 'ESTADO DE PAGO','ACCIONES'];
  dataSource = new MatTableDataSource<Aportacion>;

  constructor(
    private servicioAportacion: AportacionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarAportaciones();
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

  listarAportaciones(){
    return this.servicioAportacion.getAportaciones().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
        },
      error: error => {
        console.log("Ocurrio un error en la carga")
      }
      }
    )
  }

  abrirDialogoPago(fila: any){
    // this.dialog.open(, {
    //   width:'700px',
    //   data:fila
    //   }).afterClosed().subscribe(valor =>{
    //     this.listarAportaciones();
    // });
  }

  eliminarAportacion(fila: any){

  }

  abrirDialogoNuevoAportacion(){
    // this.dialog.open(CrearSocioComponent, {
    //   width:'600px',
    //   }).afterClosed().subscribe(valor =>{
    //     this.listarAfiliaciones();
    // });
  }

}
