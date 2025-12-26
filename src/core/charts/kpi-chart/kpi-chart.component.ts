import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-kpi-chart',
  templateUrl: './kpi-chart.component.html',
  styleUrls: ['./kpi-chart.component.scss'],
})
export class KpiChartComponent implements OnChanges {
  // This will now be the *array* of { day/month, count }
  @Input() chartOptions: any[] = [];
  @Input() dateRange: string = 'seven days';

  // Let ECharts be dynamic, avoid strict typing issues
  accountsChartOptions: any = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartOptions'] || changes['dateRange']) {
      if (this.chartOptions && Array.isArray(this.chartOptions)) {
        this.formatData(this.chartOptions);
      }
    }
  }

  private formatData(accounts: any[]) {
    let xAxisData: string[] = [];
    let history: number[] = [];

    if (this.dateRange === 'seven days') {
      // last 7 days
      const last7 = accounts.slice(-7);
      xAxisData = last7.map(a => a.day);
      history = last7.map(a => a.count);
    } else if (this.dateRange === 'one month') {
      // last 30 days
      const last30 = accounts.slice(-30);
      xAxisData = last30.map(a => a.day);
      history = last30.map(a => a.count);
    } else if (
      this.dateRange === 'three months' ||
      this.dateRange === 'one year'
    ) {
      // monthly format
      xAxisData = accounts.map(a => a.month);
      history = accounts.map(a => a.count);
    } else {
      // fallback: auto-detect daily vs monthly
      if (accounts.length > 0 && accounts[0].day) {
        xAxisData = accounts.map(a => a.day);
        history = accounts.map(a => a.count);
      } else if (accounts.length > 0 && accounts[0].month) {
        xAxisData = accounts.map(a => a.month);
        history = accounts.map(a => a.count);
      }
    }

    this.accountsChartOptions = {
      tooltip: { trigger: 'axis' },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#666' },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
          color: '#666',
        },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#ddd' },
        },
      },
      series: [
        {
          name: 'Accounts',
          type: 'bar',
          data: history,
          // smooth removed to satisfy TS typings for bar series
          barWidth: '50%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' },
              ],
            },
            borderRadius: [5, 5, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#333',
            formatter: (params: any) =>
              params.value === 0 ? '' : params.value,
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: '#1a73e8',
            },
          },
        },
      ],
      animationDuration: 1000,
    };
  }
}
