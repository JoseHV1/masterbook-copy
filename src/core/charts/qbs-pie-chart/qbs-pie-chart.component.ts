import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-quotes-status-pie-chart',
  template: `<div
    echarts
    [options]="chartOptions"
    class="chart-container"></div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .chart-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class QuotesStatusPieChartComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() chartData!: {
    accepted: number;
    not_accepted: number;
  };

  chartOptions: EChartsOption = {};

  private mq = window.matchMedia('(max-width: 576px)');
  private isMobile = this.mq.matches;

  private mqListener = (e: MediaQueryListEvent) => {
    this.isMobile = e.matches;
    this.updateChart();
  };

  constructor() {
    if (this.mq.addEventListener) {
      this.mq.addEventListener('change', this.mqListener);
    } else {
      // @ts-ignore
      this.mq.addListener(this.mqListener);
    }
  }

  ngOnInit() {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(
      'QuotesStatusPieChart ngOnChanges → chartData:',
      this.chartData
    );
    if (changes['chartData']) this.updateChart();
  }

  ngOnDestroy(): void {
    if (this.mq.removeEventListener) {
      this.mq.removeEventListener('change', this.mqListener);
    } else {
      // @ts-ignore
      this.mq.removeListener(this.mqListener);
    }
  }

  updateChart() {
    if (!this.chartData) return;

    const accepted = this.chartData.accepted ?? 0;
    const notAccepted = this.chartData.not_accepted ?? 0;
    const total = accepted + notAccepted;

    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.name}: <b>${p.value}</b> (${p.percent}%)`,
      },

      // ✅ Desktop legend (readable). ✅ Mobile: hide (prevents cropping)
      legend: this.isMobile
        ? { show: false }
        : {
            orient: 'vertical',
            right: 10,
            top: 'middle',
            ...(typeof {} as any),
            textStyle: { color: '#111' },
            formatter: () => '',
          },

      series: [
        {
          name: 'Quotes',
          type: 'pie',
          radius: ['40%', '80%'],
          center: this.isMobile ? ['50%', '50%'] : ['50%', '45%'],
          avoidLabelOverlap: true,
          data: [
            { value: accepted, name: 'Accepted' },
            { value: notAccepted, name: 'Not Accepted' },
          ],

          // ✅ Desktop: show callouts like before
          // ✅ Mobile: show a center summary instead (no mystery colors)
          label: this.isMobile
            ? {
                show: true,
                position: 'center',
                formatter: () =>
                  `{t|Total}\n{v|${total}}\n{b|Accepted: ${accepted}}\n{b|Not accepted: ${notAccepted}}`,
                ...(typeof {} as any),
                rich: {
                  t: { fontSize: 11, color: '#777', lineHeight: 14 },
                  v: {
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#111',
                    lineHeight: 22,
                  },
                  b: { fontSize: 11, color: '#555', lineHeight: 14 },
                },
              }
            : {
                show: true,
                position: 'outside',
                formatter: '{b}',
                ...(typeof {} as any),
              },

          labelLine: this.isMobile
            ? { show: false }
            : {
                show: true,
                length: 15,
                length2: 10,
                smooth: true,
              },

          itemStyle: {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#fff',
          },

          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],

      animationDuration: 800,
    };
  }
}
