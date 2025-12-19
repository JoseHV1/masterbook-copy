import { Component, Input } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-grouped-bar-chart',
  template: `<div id="groupedBarChart" class="chart-container"></div>`,
  styleUrls: ['./grouped-bar-chart.component.scss'],
})
export class GroupedBarChartComponent {
  @Input() chartData: { type: string; value: number; company: string }[] = [];

  initChart(): void {
    const chartDom = document.getElementById('groupedBarChart');
    if (!chartDom) return;
    const myChart = echarts.init(chartDom);

    const companies = [...new Set(this.chartData.map(d => d.company))];
    const types = [...new Set(this.chartData.map(d => d.type))];

    const series = companies.map(company => ({
      name: company,
      type: 'bar',
      data: types.map(type => {
        const entry = this.chartData.find(
          d => d.type === type && d.company === company
        );
        return entry ? entry.value : 0;
      }),
    }));

    const option = {
      title: { text: 'Quotes by status', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: companies, bottom: 0 },
      xAxis: { type: 'category', data: types },
      yAxis: { type: 'value' },
      series,
    };

    myChart.setOption(option);
  }
}
