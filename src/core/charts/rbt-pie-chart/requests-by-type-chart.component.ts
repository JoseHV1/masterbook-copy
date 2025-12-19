import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-rbt-pie-chart',
  templateUrl: './requests-by-type-chart.component.html',
  styleUrls: ['./requests-by-type-chart.component.scss'],
})
export class RequestsByTypePieChartComponent {
  @Input() requestsData: {
    type: string;
    value: number;
    date: string;
    agent: string;
    company: string;
  }[] = [];

  chartOptions: any;

  filterForm: any = {
    agent: null,
    company: null,
    startDate: null,
    endDate: null,
  };
  filteredData: {
    type: string;
    value: number;
    date: string;
    agent: string;
    company: string;
  }[] = [];

  agents = [
    { code: 'agent-1', name: 'Agent 1' },
    { code: 'agent-2', name: 'Agent 2' },
    // Add more agents here
  ];

  companies = [
    { code: 'company-1', name: 'Company 1' },
    { code: 'company-2', name: 'Company 2' },
    // Add more companies here
  ];

  // Initialize the filter form group

  // Filter the data based on selected criteria
  filterData() {
    this.filteredData = this.requestsData;

    const { agent, company, startDate, endDate } = this.filterForm;

    if (agent) {
      this.filteredData = this.filteredData.filter(
        data => data.agent === agent
      );
    }

    if (company) {
      this.filteredData = this.filteredData.filter(
        data => data.company === company
      );
    }

    if (startDate) {
      this.filteredData = this.filteredData.filter(
        data => new Date(data.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      this.filteredData = this.filteredData.filter(
        data => new Date(data.date) <= new Date(endDate)
      );
    }

    this.initChart(); // Re-render the chart with filtered data
  }

  // Initialize the chart with filtered data
  initChart() {
    const groupedData: { [key: string]: number } = this.filteredData.reduce(
      (acc, { type, value }) => {
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type] += value;
        return acc;
      },
      {} as { [key: string]: number }
    );

    this.chartOptions = {
      title: { text: 'Quotes Status', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: 'Requests',
          type: 'pie', // Pie chart type (not donut)
          radius: '70%', // Use a single value to make it a regular pie chart
          data: Object.entries(groupedData).map(([type, value]) => ({
            name: type,
            value,
          })),
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

  // Load the data initially
}
