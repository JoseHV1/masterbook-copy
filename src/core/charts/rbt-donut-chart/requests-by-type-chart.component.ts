import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { EChartsOption } from 'echarts';

type DonutData = {
  // frontend-friendly
  requested?: number;
  responded?: number;

  // backend shape you currently receive
  answered?: number;
  unanswered?: number;
};

@Component({
  selector: 'app-requests-by-type-chart',
  templateUrl: './requests-by-type-chart.component.html',
  styleUrls: ['./requests-by-type-chart.component.scss'],
})
export class RequestsByTypeChartComponent implements OnChanges, OnDestroy {
  @Input() chartData!: DonutData;
  @Input() dateRange: string = 'seven%20days';

  chartOptions: EChartsOption = {};

  private mq = window.matchMedia('(max-width: 576px)');
  private isMobile = this.mq.matches;

  private mqListener = (e: MediaQueryListEvent) => {
    this.isMobile = e.matches;
    if (this.chartData) this.formatData(this.chartData);
  };

  constructor() {
    if (this.mq.addEventListener) {
      this.mq.addEventListener('change', this.mqListener);
    } else {
      // @ts-ignore
      this.mq.addListener(this.mqListener);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('RequestsByTypeChart ngOnChanges → chartData:', this.chartData);
    if (changes['chartData'] || changes['dateRange']) {
      this.formatData(this.chartData);
    }
  }

  ngOnDestroy(): void {
    if (this.mq.removeEventListener) {
      this.mq.removeEventListener('change', this.mqListener);
    } else {
      // @ts-ignore
      this.mq.removeListener(this.mqListener);
    }
  }

  private normalize(data: DonutData) {
    // Prefer explicit requested/responded if present, otherwise map backend answered/unanswered.
    const requested = data.requested ?? data.unanswered ?? 0;
    const responded = data.responded ?? data.answered ?? 0;
    return { requested, responded };
  }

  formatData(data: DonutData) {
    if (!data) return;

    const { requested, responded } = this.normalize(data);

    const donutData = [
      { name: 'Requested', value: requested },
      { name: 'Responded', value: responded },
    ];

    const total = requested + responded;

    this.chartOptions = {
      // Helpful when options update frequently
      animation: true,

      title: { text: '', left: 'center' },

      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.name}: <b>${p.value}</b> (${p.percent}%)`,
      },

      legend: this.isMobile
        ? { show: false }
        : {
            orient: 'vertical',
            right: 10,
            top: 'middle',
            ...(typeof {} as any),
            textStyle: { color: 'black' },
            formatter: () => '',
          },

      series: [
        {
          name: 'Requests',
          type: 'pie',
          radius: ['45%', '80%'],
          center: this.isMobile ? ['50%', '50%'] : ['49%', '45%'],
          avoidLabelOverlap: true,
          data: donutData,

          label: this.isMobile
            ? {
                show: true,
                position: 'center',
                formatter: () =>
                  `{t|Total}\n{v|${total}}\n{b|Requested: ${requested}}\n{b|Responded: ${responded}}`,
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
            : { show: true },

          labelLine: { show: true },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
}
