import { AfterViewInit, Component, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { GenericService } from 'src/app/share/generic.service';

enum TypeGraph {
  BAR = 'bar',
  BUBBLE = 'bubble',
  DOUGHNUT = 'doughnut',
  PIE = 'pie',
  LINE = 'line',
  POLARAREA = 'polarArea',
  RADAR = 'radar',
  SCATTER = 'scatter',
}

@Component({
  selector: 'app-reporte-grafico',
  templateUrl: './reporte-grafico.component.html',
  styleUrls: ['./reporte-grafico.component.css'],
})
export class ReporteGraficoComponent implements AfterViewInit {
  //Canvas para el grafico
  canvas: any;
  //Contexto del Canvas
  ctx: any;
  //Elemento html del Canvas del gráfico 1
  @ViewChild('graficoCanvas1') graficoCanvas1!: { nativeElement: any };
  //Elemento html del Canvas del gráfico 2
  @ViewChild('graficoCanvas2') graficoCanvas2!: { nativeElement: any };

  //Datos para mostrar en el gráfico
  datos: any;
  //Lista de meses para filtrar el gráfico
  mesList: any;
  //Mes actual
  filtro = new Date().getMonth();
  //Colores

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private gService: GenericService) {
    this.listaMeses();
  }
  listaMeses() {
    this.mesList = [
      { Value: 1, Text: 'Enero' },
      { Value: 2, Text: 'Febrero' },
      { Value: 3, Text: 'Marzo' },
      { Value: 4, Text: 'Abril' },
      { Value: 5, Text: 'Mayo' },
      { Value: 6, Text: 'Junio' },
      { Value: 7, Text: 'Julio' },
      { Value: 8, Text: 'Agosto' },
      { Value: 9, Text: 'Septiembre' },
      { Value: 10, Text: 'Octubre' },
      { Value: 11, Text: 'Noviembre' },
      { Value: 12, Text: 'Diciembre' },
    ];
  }
  ngAfterViewInit(): void {
    this.inicioGrafico(this.filtro);
  }
  inicioGrafico(newValue: any) {
    this.filtro = newValue;
    if (this.filtro) {
      //Obtener información del API
      console.log('orden/vProducto/' + this.filtro);
      this.gService
        .get('orden/vProducto', this.filtro)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.datos = data;
          this.graficoBrowser(this.graficoCanvas1.nativeElement, TypeGraph.BAR);
          this.graficoBrowser(this.graficoCanvas2.nativeElement, TypeGraph.PIE);
        });
    }
  }
  colorRandom() {
    return Math.floor(Math.random() * 255) + 1;
  }
  updateDataGrafico(chart: Chart){
    // Actualizar los datos del gráfico
    chart.data. datasets= [
      {
        label: 'Videojuegos',
        backgroundColor: [
          `rgba(0, 0, ${this.colorRandom()}, 0.35)`,
          `rgba(60, 179, ${this.colorRandom()}, 0.35)`,
          `rgba(${this.colorRandom()}, 165, 0, 0.35)`,
          `rgba(106, 90, ${this.colorRandom()}, 0.35)`,
          `rgba(${this.colorRandom()}, 130, 238, 0.35)`,
          `rgba(${this.colorRandom()}, 0, 0, 0.35)`,
          `rgba(${this.colorRandom()}, 210, 210, 0.35)`,
        ],
        borderWidth: 1,
        //Datos del grafico, debe ser un array
        data: this.datos.map((x: { suma: any }) => {
          return x.suma;
        }),
      },
    ]
    chart.update();
  }
  updateConfigGrafico(chart: Chart){
    // Mantener las configuraciones del gráfico
    chart.options={
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Compras por Videojuego',
        },
      },
    }
    chart.update();
  }
  //Configurar y crear gráfico
  graficoBrowser(canvas: any, typeG: TypeGraph): void {
    this.ctx = canvas.getContext('2d');
    //let grafico;
    let grafico=Chart.getChart(canvas);
    //Si existe destruir el Canvas para mostrar el grafico
    if(grafico && grafico!=undefined && grafico !=null){
      this.updateDataGrafico(grafico);
      this.updateConfigGrafico(grafico);
    }else{
       grafico = new Chart(this.ctx, {
        type: typeG,
        data: {
          //Etiquetas debe ser un array
          labels: this.datos.map((x: { nombre: any }) => x.nombre),
          datasets: [
            {
              label: 'Videojuegos',
              backgroundColor: [
                `rgba(0, 0, ${this.colorRandom()}, 0.35)`,
                `rgba(60, 179, ${this.colorRandom()}, 0.35)`,
                `rgba(${this.colorRandom()}, 165, 0, 0.35)`,
                `rgba(106, 90, ${this.colorRandom()}, 0.35)`,
                `rgba(${this.colorRandom()}, 130, 238, 0.35)`,
                `rgba(${this.colorRandom()}, 0, 0, 0.35)`,
                `rgba(${this.colorRandom()}, 210, 210, 0.35)`,
              ],
              borderWidth: 1,
              //Datos del grafico, debe ser un array
              data: this.datos.map((x: { suma: any }) => {
                return x.suma;
              }),
            },
          ]
        },
        options:{
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Compras por Videojuego',
            },
          },
        }
  
      });}
    }  

  ngOnDestroy() {
    this.destroy$.next(true);
    // Desinscribirse
    this.destroy$.unsubscribe();
  }
}
