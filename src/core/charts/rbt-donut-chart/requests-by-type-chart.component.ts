import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { EChartsOption } from 'echarts';

export enum RequestStatusEnum {
  PENDING_QUOTES = 'PENDING_QUOTES',
  PENDING_SELECTION = 'PENDING_SELECTION',
  QUOTE_SELECTED = 'QUOTE_SELECTED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
  PENDING_CANCELLATION = 'PENDING_CANCELLATION',
}

type RequestsByStatus = Partial<Record<RequestStatusEnum, number>>;

type LegacyDonutData = {
  requested?: number;
  responded?: number;
  answered?: number;
  unanswered?: number;
};

type DonutData = RequestsByStatus & LegacyDonutData;

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

  private statusLabel(status: string): string {
    return status
      .toLowerCase()
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private buildStatusSeries(data: DonutData) {
    const statuses = Object.values(RequestStatusEnum);

    const hasNewShape = statuses.some(
      s => typeof (data as any)[s] === 'number'
    );

    if (hasNewShape) {
      const donutData = statuses
        .map(status => ({
          name: this.statusLabel(status),
          status,
          value: Number((data as any)[status] ?? 0),
        }))
        .filter(d => d.value > 0);

      return donutData.length ? donutData : [{ name: 'No Data', value: 0 }];
    }

    const requested = data.requested ?? data.unanswered ?? 0;
    const responded = data.responded ?? data.answered ?? 0;

    return [
      { name: 'Requested', value: requested },
      { name: 'Responded', value: responded },
    ];
  }

  formatData(data: DonutData) {
    if (!data) return;

    const donutData: any[] = this.buildStatusSeries(data) as any[];

    const total = donutData.reduce(
      (sum: number, d: any) => sum + (d.value ?? 0),
      0
    );

    const topTwo = [...donutData]
      .filter((d: any) => (d.value ?? 0) > 0)
      .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0))
      .slice(0, 2);

    const topTwoLines = topTwo
      .map((d: any) => `${d.name}: ${d.value}`)
      .join('\n');

    this.chartOptions = {
      animation: true,

      tooltip: {
        trigger: 'item',
        formatter: (p: any) => `${p.name}: <b>${p.value}</b> (${p.percent}%)`,
      },

      legend: { show: false }, // ✅ legend fully hidden

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
                  topTwoLines
                    ? `{t|Total}\n{v|${total}}\n{b|${topTwoLines}}`
                    : `{t|Total}\n{v|${total}}`,
                rich: {
                  t: { fontSize: 11, color: '#777', lineHeight: 14 },
                  v: {
                    fontSize: 18,
                    fontWeight: 700,
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
