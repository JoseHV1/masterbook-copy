import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-area-chart',
  template: `
    <div echarts [options]="chartOptions" class="chart-container"></div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 400px;
      }
    `,
  ],
})
export class AreaChartComponent implements OnInit, OnChanges {
  @Input() chartData: { month: string; values: number[] }[] = [];
  @Input() insuranceTypes: string[] = [];

  chartOptions: EChartsOption = {};

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }

  updateChart() {
    this.chartOptions = {
      title: { text: 'Active Policies Trends' },
      tooltip: { trigger: 'axis' },
      legend: {
        data: this.insuranceTypes,
        bottom: 0, // Moves the legend to the bottom
        left: 'center', // Centers the legend horizontally
        orient: 'horizontal', // Displays legend in a single row
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%', // Leaves space for the legend
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: this.chartData.map(d => d.month),
      },
      yAxis: { type: 'value' },
      series: this.insuranceTypes.map((type, index) => ({
        name: type,
        type: 'line',
        stack: 'total',
        areaStyle: {},
        data: this.chartData.map(d => d.values[index]),
      })),
    };
  }
}
