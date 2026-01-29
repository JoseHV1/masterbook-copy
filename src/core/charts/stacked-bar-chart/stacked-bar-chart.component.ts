import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-stacked-bar-chart',
  template: `
    <div echarts [options]="chartOptions" class="chart-container"></div>
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 30vh;
        text-align: center;
        border: none;
      }
    `,
  ],
})
export class StackedBarChartComponent implements OnChanges {
  @Input() chartOptions: EChartsOption = {};
  @Input() dateRange: string = 'seven days';

  ngOnChanges(changes: SimpleChanges) {
    if (this.chartOptions && (this.chartOptions as any)['results']) {
      this.formatData(this.chartOptions);
      return;
    }

    // ✅ NEW: support admin usage breakdown payload too
    if (
      this.chartOptions &&
      Array.isArray((this.chartOptions as any)['data']) &&
      Array.isArray((this.chartOptions as any)['types'])
    ) {
      this.formatData(this.chartOptions);
      return;
    }
  }

  private prettyLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private formatBucketLabel(bucket: string): string {
    // Supports: yyyy-MM-dd (daily) or yyyy-MM (monthly)
    if (/^\d{4}-\d{2}-\d{2}$/.test(bucket)) {
      const [, mm, dd] = bucket.split('-');
      return `${mm}/${dd}`; // e.g. 01/28
    }

    if (/^\d{4}-\d{2}$/.test(bucket)) {
      const [yyyy, mm] = bucket.split('-');
      const date = new Date(Number(yyyy), Number(mm) - 1);
      return date.toLocaleString('default', {
        month: 'short',
        year: '2-digit',
      }); // e.g. Jan 26
    }

    return bucket;
  }

  private shouldShowLabelEvery(index: number, total: number): boolean {
    if (total <= 10) return true;
    if (total <= 31) return index % 3 === 0; // ~30d
    if (total <= 100) return index % 7 === 0; // ~90d
    return index % 14 === 0; // longer ranges
  }

  formatData(data: any): void {
    if (!data) return;

    /**
     * ✅ Admin usage breakdown payload support
     * Expected shape:
     * {
     *   isDaily: boolean,
     *   types: string[],
     *   data: Array<{ bucket: string } & Record<string, number>>
     * }
     */
    if (
      Array.isArray((data as any)?.data) &&
      Array.isArray((data as any)?.types)
    ) {
      const rows = (data as any).data as Array<Record<string, any>>;
      const rawTypes = (data as any).types as string[];

      // ✅ hide series that are all zeros
      const types = rawTypes.filter(t =>
        rows.some(r => Number(r?.[t] ?? 0) > 0)
      );

      const rawBuckets = rows.map(r => String(r['bucket']));
      const xAxisData = rawBuckets.map(b => this.formatBucketLabel(b));

      const seriesData = types.map(t => ({
        name: this.prettyLabel(t),
        type: 'bar',
        stack: 'total',

        // ✅ consistent spacing + thickness
        barMaxWidth: 28,
        barGap: '20%',

        // ✅ rounded top corners
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },

        emphasis: { focus: 'series' },
        data: rows.map(r => Number(r?.[t] ?? 0)),
      }));

      // ✅ FIX: move legend UP + reserve space for it (prevents divider overlap)
      this.chartOptions = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },

          // ✅ nicer tooltip (total + sorted breakdown, hides zeros)
          formatter: (params: any) => {
            if (!Array.isArray(params) || params.length === 0) return '';

            const idx = params[0].dataIndex;
            const raw = rawBuckets[idx] ?? params[0].axisValue;
            const total = params.reduce(
              (sum: number, p: any) => sum + (Number(p?.data) || 0),
              0
            );

            const breakdown = params
              .filter((p: any) => Number(p?.data) > 0)
              .sort(
                (a: any, b: any) =>
                  (Number(b?.data) || 0) - (Number(a?.data) || 0)
              )
              .map(
                (p: any) =>
                  `<div>${p.marker} ${p.seriesName}: <b>${p.data}</b></div>`
              );

            return [
              `<div style="font-weight:600;margin-bottom:6px;">${this.formatBucketLabel(
                String(raw)
              )}</div>`,
              `<div style="margin-bottom:6px;color:#666;">Total: <b>${total}</b></div>`,
              ...breakdown,
            ].join('');
          },
        },

        legend: {
          orient: 'horizontal',
          bottom: 22, // ✅ was 8 — lift legend away from divider
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
            color: '#6b7280',
          },
        },

        grid: {
          top: 16,
          left: 16,
          right: 16,
          bottom: 90, // ✅ was 72 — reserve legend space
          containLabel: true,
        },

        xAxis: {
          type: 'category',
          data: xAxisData,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisLabel: {
            color: '#6b7280',
            interval: (index: number, _value: string) =>
              this.shouldShowLabelEvery(index, xAxisData.length),
          },
        },

        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6' } },
          axisLabel: { color: '#6b7280' },
        },

        series: seriesData as EChartsOption['series'],
      };

      return;
    }

    // ---------------- Existing logic (policy categories) ----------------

    const categoriesMap: Record<string, string> = {
      car: 'Auto',
      property: 'Home',
      life: 'Life',
      health: 'Health',
      umbrella: 'Umbrella',
      accident: 'Accident',
      trip: 'Trip',
      other: 'Other',
    };

    const seriesData: any[] = [];
    let xAxisData: string[] = [];

    switch (this.dateRange) {
      case 'Last 7 Days': {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        xAxisData = daysOfWeek;

        const results = (data as any).results || {};
        for (const [key, label] of Object.entries(categoriesMap)) {
          const dayCounts = results[key] || {};
          const values = daysOfWeek.map(day => dayCounts[day]?.count || 0);

          seriesData.push({
            name: label,
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'series' },
            data: values,
          });
        }
        break;
      }

      case 'Last 30 Days': {
        const results = (data as any).results || {};

        const allDatesSet = new Set<string>();
        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(date => allDatesSet.add(date));
        }
        const allDates = Array.from(allDatesSet).sort();
        xAxisData = allDates.map(d => this.formatBucketLabel(d)); // ✅ nicer labels

        for (const [key, label] of Object.entries(categoriesMap)) {
          const dateCounts = results[key] || {};
          const values = allDates.map(date => dateCounts[date]?.count || 0);

          seriesData.push({
            name: label,
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'series' },
            data: values,
          });
        }
        break;
      }

      case 'Last 90 Days': {
        const results = (data as any).results || {};
        const allMonthsSet = new Set<string>();

        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(month => allMonthsSet.add(month));
        }

        const allMonths = Array.from(allMonthsSet).sort();
        xAxisData = allMonths.map(m => this.formatBucketLabel(m)); // ✅ prettier

        for (const [key, label] of Object.entries(categoriesMap)) {
          const monthCounts = results[key] || {};
          const values = allMonths.map(month => monthCounts[month]?.count || 0);

          seriesData.push({
            name: label,
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'series' },
            data: values,
          });
        }
        break;
      }

      case 'Year to Date': {
        const results = (data as any).results || {};
        const allMonthsSet = new Set<string>();

        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(month => allMonthsSet.add(month));
        }

        const allMonths = Array.from(allMonthsSet).sort();
        xAxisData = allMonths.map(m => this.formatBucketLabel(m)); // ✅ prettier

        for (const [key, label] of Object.entries(categoriesMap)) {
          const monthCounts = results[key] || {};
          const values = allMonths.map(month => monthCounts[month]?.count || 0);

          seriesData.push({
            name: label,
            type: 'bar',
            stack: 'total',
            emphasis: { focus: 'series' },
            data: values,
          });
        }
        break;
      }

      default: {
        const customDateRangeRegex = /^\d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}$/;

        if (customDateRangeRegex.test(this.dateRange)) {
          const results = (data as any).results || {};
          const [startDateStr, endDateStr] = this.dateRange.split(' to ');

          const sampleCategory = Object.values(results).find(
            r =>
              typeof r === 'object' &&
              r !== null &&
              Object.keys(r as object).length > 0
          );

          const sampleKeys = sampleCategory ? Object.keys(sampleCategory) : [];
          const isMonthly =
            sampleKeys.length > 0 && /^\d{4}-\d{2}$/.test(sampleKeys[0]);

          if (isMonthly) {
            const allMonthsSet = new Set<string>();
            for (const key of Object.keys(categoriesMap)) {
              const categoryData = results[key] || {};
              Object.keys(categoryData).forEach(month =>
                allMonthsSet.add(month)
              );
            }

            const allMonths = Array.from(allMonthsSet).sort();
            xAxisData = allMonths.map(m => this.formatBucketLabel(m));

            for (const [key, label] of Object.entries(categoriesMap)) {
              const monthCounts = results[key] || {};
              const values = allMonths.map(
                month => monthCounts[month]?.count || 0
              );

              seriesData.push({
                name: label,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                data: values,
              });
            }
          } else {
            const allDates = this.generateDateRange(startDateStr, endDateStr);
            xAxisData = allDates.map(d => this.formatBucketLabel(d));

            for (const [key, label] of Object.entries(categoriesMap)) {
              const dateCounts = results[key] || {};
              const values = allDates.map(date => dateCounts[date]?.count || 0);

              seriesData.push({
                name: label,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                data: values,
              });
            }
          }
        } else {
          console.warn(
            `Unsupported or unrecognized dateRange format: ${this.dateRange}`
          );
          return;
        }

        break;
      }
    }

    // ✅ FIX (non-admin mode too): never use negative bottom; reserve legend space like admin
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },

      legend: {
        orient: 'horizontal',
        bottom: 22, // ✅ was -50 (bad). Lift away from divider.
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#6b7280',
        },
      },

      grid: {
        top: 16,
        left: 16,
        right: 16,
        bottom: 90, // ✅ reserve legend space
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: {
          color: '#6b7280',
          interval: (index: number, value: string) =>
            this.shouldShowLabelEvery(index, xAxisData.length),
        },
      },

      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6' } },
        axisLabel: { color: '#6b7280' },
      },

      series: seriesData as EChartsOption['series'],
    };
  }

  generateDateRange(start: string, end: string): string[] {
    const dateArray: string[] = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dateArray.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    return dateArray;
  }
}
