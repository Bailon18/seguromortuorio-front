import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Socio } from './model/socio';
import { AfiliadosService } from './services/afiliados.service';
import { CrearSocioComponent } from './modals/crear-socio/crear-socio.component';
import { CrearFamiliarComponent } from './modals/crear-familiar/crear-familiar.component';
import { ReporteAportacionesComponent } from './modals/reporte-aportaciones/reporte-aportaciones.component';
import jsPDF from 'jspdf';
import autoTable, { Styles } from 'jspdf-autotable'; 
import swall from 'sweetalert2';


@Component({
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.css']
})
export class AfiliadosComponent implements AfterViewInit , OnInit {

  estadoFiltro:any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['ID', 'FECHA DE INSCRIPCION',  'NOMBRE', 'APELLIDOS', 'DOCUMENTO IDENTIDAD', 'TELEFONO','ACCIONES'];
  dataSource = new MatTableDataSource<Socio>;
  socios: Socio[] = [];

  constructor(
    private servicioAfiliacion: AfiliadosService,
    public dialog: MatDialog
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
        let filtrado = res.filter(u => u.activo == true)
        this.socios = res
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

    if(!this.estadoFiltro){

      this.servicioAfiliacion.getAfiliaciones().subscribe(
        {next: res => {
          let filtrado = res.filter(u => u.activo==false)
          this.dataSource = new MatTableDataSource(filtrado)
          this.dataSource.paginator = this.paginator;
          },
          error: error => {
            console.log("Ocurrio un error en la carga")
          }
        }
      )
        
      }else{
        this.listarAfiliaciones();
        
      }
  }

  abrirDialogoFamiliar(fila: any){
    this.dialog.open(CrearFamiliarComponent, {
      width:'700px',
      data:fila
      }).afterClosed().subscribe(valor =>{
        this.listarAfiliaciones();
    });
  }

  abrirDialogoReporte(fila: any){
    this.dialog.open(ReporteAportacionesComponent, {
      width:'700px',
      data:fila
      }).afterClosed().subscribe(valor =>{
        this.listarAfiliaciones();
    });
  }

  abrirDialogoNuevoAfiliado(){
    this.dialog.open(CrearSocioComponent, {
      width:'600px',
      }).afterClosed().subscribe(valor =>{
        this.listarAfiliaciones();
    });
  }


  exportarFamiliaresAPdf(){

    
  }

  editarAfiliado(fila: any){
    this.dialog.open(CrearSocioComponent, {
      width:'600px',
      data:fila
      }).afterClosed().subscribe(valor =>{
          this.listarAfiliaciones();
    });
  }

  bloquearAfiliado(fila: any){
    const esBloqueo = !fila.activo;
    const accion = !esBloqueo ? 'bloquear' : 'habilitar';
    const pregunta = `¿Estás seguro de ${accion} a <strong>${fila.nombre}</strong>?`;
    const mensajeBoton = `Sí, ${accion}!`;
    const mensajeConfirmacion = `Socio ${accion}do con éxito!`;

    swall.fire({
      html: pregunta,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0275d8',
      cancelButtonColor: '#9c9c9c',
      confirmButtonText: mensajeBoton,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioAfiliacion.cambiarEstado(fila.id, esBloqueo).subscribe({
          next: (res) => {
            this.listarAfiliaciones();
          },
          error: (error) => {
            console.error('Ocurrió un error', error);
          },
        });

        swall.fire({
          icon: 'success',
          html: mensajeConfirmacion,
        });
      }
    });
  }

  verReporteSocios(){

      const doc = new jsPDF();

      doc.setFontSize(17);
      doc.text('Listado de Socios', 15, 15);

      const headers = ['Documento Identidad', 'Nombre', 'Apellido', 'Edad', 'Dirección', 'Correo Electrónico'];
      const data = this.socios.map(socio => [
        socio.documentoIdentidad,
        socio.nombre,
        socio.apellido,
        socio.edad.toString() + ' años',
        socio.direccion,
        socio.correoElectronico
      ]);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 25,
        headStyles: { fillColor: [47, 64, 83] }
      });

      doc.save('Reporte-Socios.pdf');
  }
}
