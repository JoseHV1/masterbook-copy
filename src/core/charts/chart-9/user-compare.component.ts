import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-user-compare',
  templateUrl: './user-compare.component.html',
  styleUrls: ['./user-compare.component.scss'],
})
export class userCompareChartComponent implements OnInit {
  chartOptions: EChartsOption = {};

  userNames: any[] = [
    'Alice Johnson',
    'Bob Smith',
    'Carlos Ramirez',
    'Daniel Lee',
    'Emily White',
    'Frank Harris',
    'Grace Kim',
    'Henry Brown',
    'Isabella Martinez',
    'Jack Wilson',
  ];

  solicitudesData = [25, 40, 35, 20, 50, 30, 45, 15, 60, 28];
  cotizacionesData = [18, 33, 30, 15, 45, 25, 38, 10, 55, 22];
  polizasData = [10, 25, 20, 12, 40, 18, 30, 8, 50, 14];
  reclamacionesData = [5, 8, 6, 4, 10, 7, 9, 3, 12, 5];

  ngOnInit(): void {
    this.chartOptions = {
      title: {
        text: 'Actividad por Usuario (Performance)',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        bottom: 0,
        left: 'center',
        itemWidth: 14,
        itemHeight: 14,
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          yAxisIndex: 0,
          start: 0,
          end: 50,
          handleSize: '100%',
        },
      ],
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: this.userNames,
      },
      series: [
        {
          name: 'Solicitudes',
          type: 'bar',
          stack: 'total',
          data: this.solicitudesData,
        },
        {
          name: 'Cotizaciones',
          type: 'bar',
          stack: 'total',
          data: this.cotizacionesData,
        },
        {
          name: 'Pólizas Emitidas',
          type: 'bar',
          stack: 'total',
          data: this.polizasData,
        },
        {
          name: 'Reclamaciones',
          type: 'bar',
          stack: 'total',
          data: this.reclamacionesData,
        },
      ],
    };
  }
}
