import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'Sin titulo';

  @Input('labels') doughnutChartLabels: string[] = ['Label1', 'Label2', 'Label3'];

  @Input('data') datos: number[] = [350, 450, 100];
  public colores: string[] = ['#6857E6', '#009FEE', '#F02059']; 

  // Doughnut
  // public doughnutChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: this.datos,
        backgroundColor: this.colores
      },
    ]
  };

  public doughnutChartType: ChartType = 'doughnut';

  ngOnChanges(changes: SimpleChanges): void {

    this.doughnutChartData={
      labels: this.doughnutChartLabels,
      datasets: [
        { data: this.datos,
          backgroundColor: this.colores 
        },
      ]
    }
    
  }

}
