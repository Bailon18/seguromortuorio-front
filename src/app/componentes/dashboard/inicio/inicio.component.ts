import { Component, OnInit, OnDestroy } from '@angular/core';
import { AportacionService } from '../pagos/services/aportaciones.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit, OnDestroy {

  reportes: any[] = [];
  areaChart: Chart;
  pieChart: Chart;

  constructor(private reportesService: AportacionService) { }

  ngOnInit(): void {
    this.obtenerReportes();
  }

  ngOnDestroy(): void {
    // Destruir gráficos al salir del componente para liberar recursos
    this.destruirGraficos();
  }

  obtenerReportes() {
    this.reportesService.getReportes().subscribe(
      (data) => {
        this.reportes = data;
        console.log(data);
        // Después de obtener los reportes, muestra los gráficos
        this.mostrarGraficos();
      },
      (error) => {
        console.error('Error al obtener los reportes', error);
      }
    );
  }

  mostrarGraficos() {
    // Destruir gráficos existentes si es necesario
    this.destruirGraficos();

    // Datos de ejemplo (reemplaza esto con tus datos reales)
    const data = [10, 20, 30, 40, 50];

    // Configuración del gráfico de área
    this.areaChart = new Chart('myAreaChart', {
      type: 'line',
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
        datasets: [
          {
            label: 'Earnings Overview',
            data: data,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });

    // Configuración del gráfico de pastel
    this.pieChart = new Chart('myPieChart', {
      type: 'doughnut',
      data: {
        labels: ['Direct', 'Social', 'Referral'],
        datasets: [
          {
            data: [30, 40, 30],
            backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)'],
          },
        ],
      },
    });
  }

  destruirGraficos() {
    // Destruir gráficos existentes si es necesario
    if (this.areaChart) {
      this.areaChart.destroy();
    }

    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }
}
