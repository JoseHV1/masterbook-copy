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
    if (this.chartOptions && this.chartOptions['results']) {
      this.formatData(this.chartOptions);
    }
  }

  formatData(data: any): void {
    if (!data) return;

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

    const seriesData = [];
    let xAxisData: string[] = [];

    switch (this.dateRange) {
      case 'Last 7 Days': {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        xAxisData = daysOfWeek;

        const results = data.results || {};
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
        // All these formats follow the same structure: data.data[0].results
        const results = data.results || {};

        // Collect all unique dates
        const allDatesSet = new Set<string>();
        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(date => allDatesSet.add(date));
        }
        const allDates = Array.from(allDatesSet).sort(); // sort chronologically
        xAxisData = allDates;

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
        const results = data.results || {};

        const allMonthsSet = new Set<string>();

        // Collect all unique "year-month" keys like "2025-03"
        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(month => allMonthsSet.add(month));
        }

        const allMonths = Array.from(allMonthsSet).sort(); // Ensure chronological order
        xAxisData = allMonths.map(m => {
          const [year, monthNum] = m.split('-');
          const date = new Date(Number(year), Number(monthNum) - 1); // month is 0-based
          return date.toLocaleString('default', {
            month: 'short',
            year: '2-digit',
          }); // e.g., "Mar 25"
        });

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
        const results = data.results || {};

        const allMonthsSet = new Set<string>();

        // Collect all unique "year-month" keys like "2025-01", "2025-02", etc.
        for (const key of Object.keys(categoriesMap)) {
          const categoryData = results[key] || {};
          Object.keys(categoryData).forEach(month => allMonthsSet.add(month));
        }

        const allMonths = Array.from(allMonthsSet).sort(); // Ensure chronological order
        xAxisData = allMonths.map(m => {
          const [year, monthNum] = m.split('-');
          const date = new Date(Number(year), Number(monthNum) - 1);
          return date.toLocaleString('default', { month: 'short' }); // Show as "Jan", "Feb", etc.
        });

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
          const results = data.results || {};
          const [startDateStr, endDateStr] = this.dateRange.split(' to ');

          // Determine if the keys are dates (daily) or months
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
            // MONTHLY CUSTOM RANGE
            const allMonthsSet = new Set<string>();
            for (const key of Object.keys(categoriesMap)) {
              const categoryData = results[key] || {};
              Object.keys(categoryData).forEach(month =>
                allMonthsSet.add(month)
              );
            }

            const allMonths = Array.from(allMonthsSet).sort();
            xAxisData = allMonths.map(m => {
              const [year, monthNum] = m.split('-');
              const date = new Date(Number(year), Number(monthNum) - 1);
              return date.toLocaleString('default', {
                month: 'short',
                year: '2-digit',
              }); // e.g. "Feb 25"
            });

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
            // DAILY CUSTOM RANGE
            const allDates = this.generateDateRange(startDateStr, endDateStr);
            xAxisData = allDates;

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

    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 12,
          color: '#666',
        },
      },

      grid: {
        top: '8%',
        left: '3%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
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
