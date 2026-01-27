import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

type TrendPoint = { day?: string; month?: string; count: number };

@Component({
  selector: 'app-single-line-chart',
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
export class SingleLineChartComponent implements OnChanges {
  @Input() chartData: TrendPoint[] = [];
  @Input() title = 'Active Agencies';

  chartOptions: EChartsOption = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      console.log(this.chartData);
      this.buildOptions(this.chartData ?? []);
    }
  }

  private buildOptions(data: TrendPoint[]) {
    const safe = Array.isArray(data) ? data : [];

    const isDaily = safe.length > 0 && !!safe[0].day;
    const labels = safe.map(d => (isDaily ? d.day : d.month) ?? '');
    const values = safe.map(d => Number(d.count ?? 0));

    this.chartOptions = {
      animation: true,
      animationDuration: 1200,
      animationEasing: 'cubicOut',
      animationDurationUpdate: 800,
      animationEasingUpdate: 'cubicOut',
      grid: {
        left: 12,
        right: 12,
        top: 36,
        bottom: 12,
        containLabel: true,
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
          const x = params?.[0]?.axisValue ?? '';
          const v = params?.[0]?.value ?? 0;
          return `
            <div style="font-weight:700;margin-bottom:6px;">${x}</div>
            <div>${params?.[0]?.marker ?? ''} ${this.title}: <b>${v}</b></div>
          `;
        },
      },

      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: 'rgba(16,24,40,0.18)' } },
        axisTick: { show: false },
        axisLabel: { color: '#667085' },
      },

      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#667085' },
        splitLine: { lineStyle: { color: 'rgba(16,24,40,0.08)' } },
      },

      series: [
        {
          name: this.title,
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 7,
          showSymbol: false,
          lineStyle: { width: 3, cap: 'round' },
          emphasis: { focus: 'series' },
          areaStyle: { opacity: 0.12 }, // subtle fill
        },
      ],
    };
  }
}
