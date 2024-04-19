import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AportacionService } from '../pagos/services/aportaciones.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {

  reportes: any[] = [];
  areaChart: Chart;
  pieChart: Chart;
  view: [number, number] = [0, 0];

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  single: any[] = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Meses';
  showYAxisLabel = true;
  yAxisLabel = 'Aportaciones $';

  customScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'Legenda' 
  };
  constructor(private reportesService: AportacionService) { 

    Object.assign(this, { single:this.single });
  }

  ngOnInit(): void {
    this.obtenerReportes();
  }


  obtenerReportes() {
    this.reportesService.getReportes().subscribe(
      (data) => {
        this.reportes = data;
        this.reportesService.adaptarDatosParaGrafico().subscribe(
          (adaptedData) => {
            this.single = adaptedData;
            console.log(this.single);
            this.setViewSize();
            this.mostrarGraficos();
          },
          (error) => {
            console.error('Error al adaptar los datos para el gráfico', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener los reportes', error);
      }
    );
  }

  mostrarGraficos() {
  }

  setViewSize(): void {
   
      this.view = [Math.max(Math.floor(this.single.length / 5) * 150, this.chartContainer.nativeElement.offsetWidth), 300];
    
  }
}
