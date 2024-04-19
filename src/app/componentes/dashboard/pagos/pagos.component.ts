import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Aportacion } from './model/aportaciones';
import { AportacionService } from './services/aportaciones.service';
import { CrearPagoComponent } from './modals/crear-pago/crear-pago.component';
import { DetallePdfComponent } from './modals/detalle-pdf/detalle-pdf.component';
import swall from 'sweetalert2';
import { PagosReporteComponent } from './modals/pagos-reporte/pagos-reporte.component';

@Component({
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  estadoFiltro:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'SOCIO', 'FECHA PAGO',  'CUOTA', 'CUOTA FINADO', 'OTRAS APORTACIONES', 'ESTADO DE PAGO','ACCIONES'];
  dataSource = new MatTableDataSource<Aportacion>;
  dataSourceCopy: Aportacion[] = []; // Copia de la fuente de datos original

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
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Aplicar filtro personalizado para campos anidados
    this.dataSource.filterPredicate = (data: Aportacion, filter: string) => {
      return (
        data.socio.nombre.toLowerCase().includes(filter) ||
        data.fechaAportacion.toString().toLowerCase().includes(filter) ||
        data.socio.apellido.toLowerCase().includes(filter) ||
        data.socio.documentoIdentidad.includes(filter) ||
        data.estadoPago.toUpperCase() === filter.toUpperCase() || 
        data.metodoPago.toUpperCase() === filter.toLowerCase() ||
        parseFloat(data.cuotas.toString()) === parseFloat(filter) || 
        parseFloat(data.cuotasFinados.toString()) === parseFloat(filter) ||
        parseFloat(data.otrasAportaciones.toString()) === parseFloat(filter) 
      );
    };
    

    // Aplicar filtro a la copia de la fuente de datos original
    this.dataSource.filter = filterValue;
  }

  listarAportaciones() {
    return this.servicioAportacion.getAportaciones().subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSourceCopy = res; 
        this.dataSource.paginator = this.paginator;
      },
      error: error => {
        console.log("Ocurrió un error en la carga");
      }
    });
  }

  abrirDialogoPdfDettale(fila: any){
    this.dialog.open(DetallePdfComponent, {
      width:'700px',
      data:fila
      }).afterClosed().subscribe(valor =>{
        this.listarAportaciones();
    });
  }

  abrirDialogoReporte(){
    this.dialog.open(PagosReporteComponent, {
      width:'600px',
      }).afterClosed().subscribe(valor =>{
        this.listarAportaciones();
    });
  }

  eliminarAportacion(fila: any){
    swall.fire({
      html: `¿Estas seguro de eliminar el pago del socio: <strong>${fila.socio.nombre} ${fila.socio.apellido}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.servicioAportacion.eliminarAportacion(fila.id).subscribe({
          next:(res) => {
              this.listarAportaciones();
          },
          error:(error) => {
            console.log("Ocurrio un error")
          }
        })

        swall.fire({
          icon:'success',
          html:'Pago eliminado con exito!'
        }
        )
      } 
    })
  }

  abrirDialogoNuevoAportacion(){
    this.dialog.open(CrearPagoComponent, {
      width:'600px',
      }).afterClosed().subscribe(valor =>{
        this.listarAportaciones();
    });
  }

  abrirDialogoEditarAportacion(fila: any){
    this.dialog.open(CrearPagoComponent,{
      width:'600px',
      data:fila
    }).afterClosed().subscribe(valor =>{
    this.listarAportaciones();
      
    });
  }
}