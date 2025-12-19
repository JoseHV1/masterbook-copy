import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-payments-chart',
  template: ` <div class="chart" echarts [options]="chartOptions"></div> `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart {
        width: 100%;
        height: 100%;
        min-height: 0;
      }
    `,
  ],
})
export class PaymentsChartComponent implements OnInit {
  chartOptions: EChartsOption = {};

  ngOnInit(): void {
    this.fetchPaymentsData();
  }

  fetchPaymentsData(): void {
    // TODO: replace with real API data
    const data = [
      { date: '2024-01-01', received: 5000, pending: 3000 },
      { date: '2024-02-01', received: 7000, pending: 2500 },
      { date: '2024-03-01', received: 6500, pending: 4000 },
    ];

    const dates = data.map(d => d.date);
    const received = data.map(d => d.received);
    const pending = data.map(d => d.pending);

    this.chartOptions = {
      animation: true,
      animationDuration: 6000, // first render
      animationEasing: 'cubicOut',
      animationDurationUpdate: 3200, // when data updates
      animationEasingUpdate: 'cubicOut',
      animationDelay: 200,
      animationDelayUpdate: 200,
      grid: {
        left: 12,
        right: 12,
        top: 36,
        bottom: 12,
        containLabel: true,
      },

      legend: {
        data: ['Received', 'Pending'],
        top: 6,
        left: 8,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          color: '#444',
          fontWeight: 600,
        },
        type: 'scroll',
      },

      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: '#fff',
        borderColor: 'rgba(16,24,40,0.18)',
        borderWidth: 1,
        padding: [10, 12],
        textStyle: { color: '#111', fontSize: 12 },
        axisPointer: { type: 'line' },
        formatter: (params: any) => {
          const date = params?.[0]?.axisValue ?? '';
          const lines = (params ?? [])
            .map((p: any) => `${p.marker} ${p.seriesName}: <b>$${p.value}</b>`)
            .join('<br/>');
          return `<div style="font-weight:700;margin-bottom:6px;">${date}</div>${lines}`;
        },
      },

      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(16,24,40,0.18)' } },
        axisTick: { show: false },
        axisLabel: { color: '#667085' },
      },

      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#667085', formatter: (v: number) => `$${v}` },
        splitLine: { lineStyle: { color: 'rgba(16,24,40,0.08)' } },
      },

      series: [
        {
          name: 'Received',
          type: 'line',
          data: received,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          showSymbol: false,
          lineStyle: { width: 3, cap: 'round' },
          emphasis: { focus: 'series' },
          areaStyle: { opacity: 0.18 },
        },
        {
          name: 'Pending',
          type: 'line',
          data: pending,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          showSymbol: false,
          lineStyle: { width: 3, cap: 'round' },
          emphasis: { focus: 'series' },
          areaStyle: { opacity: 0.12 },
        },
      ],
    };
  }
}
