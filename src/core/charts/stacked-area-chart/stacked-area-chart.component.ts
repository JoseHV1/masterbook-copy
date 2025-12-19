import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { EChartsOption } from 'echarts';

export type StackedAreaSeries = {
  brokerId: string;
  brokerName: string;
  totals: number[]; // must match buckets length
};

export type StackedAreaChartData = {
  buckets: string[]; // e.g. ["2025-12-01","2025-12-02",...]
  series: StackedAreaSeries[];
};

@Component({
  selector: 'app-stacked-area-chart',
  template: `<div echarts [options]="chartOptions" class="chart"></div>`,
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
export class StackedAreaChartComponent implements OnChanges {
  @Input() data!: StackedAreaChartData;
  @Input() subtitle = 'Money over time';
  @Input() currencySymbol = '$';

  chartOptions: EChartsOption = {};

  private isMobile = window.matchMedia('(max-width: 576px)').matches;

  @HostListener('window:resize')
  onResize() {
    const next = window.matchMedia('(max-width: 576px)').matches;
    if (next !== this.isMobile) {
      this.isMobile = next;
      this.buildOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['subtitle']) {
      this.buildOptions();
    }
  }

  private formatMoney(v: number) {
    const n = Number(v ?? 0);
    if (Math.abs(n) >= 1_000_000)
      return `${this.currencySymbol}${(n / 1_000_000).toFixed(1)}M`;
    if (Math.abs(n) >= 1_000)
      return `${this.currencySymbol}${(n / 1_000).toFixed(1)}k`;
    return `${this.currencySymbol}${n.toFixed(0)}`;
  }

  private formatBucketLabel(bucket: string) {
    // "YYYY-MM" -> "Jan 2025"
    // "YYYY-MM-DD" -> "Jan 5, 2025"
    const parts = bucket.split('-');
    if (parts.length >= 2) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = parts.length >= 3 ? Number(parts[2]) : null;

      const date = new Date(year, month, day ?? 1);
      const m = date.toLocaleString(undefined, { month: 'short' });

      if (day) return `${m} ${day}, ${year}`;
      return `${m} ${year}`;
    }
    return bucket;
  }

  private buildOptions() {
    const buckets = this.data?.buckets ?? [];
    const series = this.data?.series ?? [];

    if (!buckets.length || !series.length) {
      this.chartOptions = {
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'middle',
            style: {
              text: 'No data',
              fill: '#98A2B3',
              fontSize: 12,
              fontWeight: 600,
            },
          },
        ],
      };
      return;
    }

    // Ensure series lengths match buckets
    const normalized = series.map(s => ({
      ...s,
      totals: (s.totals ?? [])
        .slice(0, buckets.length)
        .concat(
          Array(Math.max(0, buckets.length - (s.totals?.length ?? 0))).fill(0)
        ),
    }));

    const hasManySeries = normalized.length > 1;

    this.chartOptions = {
      animation: true,
      animationDuration: 900,
      animationEasing: 'cubicOut',

      // If only one series (Option A: "All brokers"), remove legend space
      grid: {
        left: 10,
        right: 10,
        top: hasManySeries ? (this.isMobile ? 36 : 42) : 18,
        bottom: 8,
        containLabel: true,
      },

      legend: hasManySeries
        ? {
            show: true,
            type: 'scroll',
            top: 6,
            left: 8,
            right: 8,
            icon: 'roundRect',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 12,
            textStyle: {
              color: '#667085',
              fontSize: 11,
              fontWeight: 600,
            },
          }
        : { show: false },

      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(16,24,40,0.10)',
        borderWidth: 1,
        padding: [10, 12],
        textStyle: { color: '#111', fontSize: 12 },
        axisPointer: {
          type: 'line',
          lineStyle: { color: 'rgba(16,24,40,0.12)', width: 1 },
        },
        formatter: (params: any) => {
          const raw =
            params?.[0]?.axisValueLabel ?? params?.[0]?.axisValue ?? '';
          const label = this.formatBucketLabel(String(raw));

          const rows = [...(params ?? [])].sort(
            (a, b) => Number(b.value ?? 0) - Number(a.value ?? 0)
          );
          const total = rows.reduce((sum, p) => sum + Number(p.value ?? 0), 0);

          const lines = rows
            .map(
              p =>
                `${p.marker} <span style="font-weight:600;">${
                  p.seriesName
                }</span>
                 <span style="float:right;margin-left:14px;font-weight:700;">
                   ${this.formatMoney(Number(p.value ?? 0))}
                 </span>`
            )
            .join('<br/>');

          return `
            <div style="font-weight:800;margin-bottom:8px;">${label}</div>
            <div style="line-height:1.6">${lines}</div>
            <div style="margin-top:10px;border-top:1px solid rgba(16,24,40,0.08);padding-top:8px;">
              <span style="font-weight:700;color:#344054;">Total</span>
              <span style="float:right;font-weight:800;color:#111;">
                ${this.formatMoney(total)}
              </span>
            </div>
          `;
        },
      },

      xAxis: {
        type: 'category',
        data: buckets,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: '#98A2B3',
          fontSize: 11,
          hideOverlap: true,
          formatter: (v: string) => this.formatBucketLabel(v),
        },
      },

      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(16,24,40,0.06)' } },
        axisLabel: {
          color: '#98A2B3',
          fontSize: 11,
          formatter: (v: number) => this.formatMoney(v),
        },
      },

      series: normalized.map(s => ({
        name: s.brokerName,
        type: 'line',
        smooth: true,
        stack: 'total',
        showSymbol: false,
        emphasis: { focus: 'series' },
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.12 },
        data: s.totals,
      })),
    };
  }
}
