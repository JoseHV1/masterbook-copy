import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-requests-by-type-nightingale-chart',
  templateUrl: './nightingale-chart.component.html',
  styleUrls: ['./nightingale-chart.component.scss'],
})
export class RequestsByTypeNightingaleChartComponent
  implements OnInit, OnChanges
{
  @Input() requestsData: {
    type: string;
    value: number;
    date: string;
    agent: string;
    company: string;
  }[] = [];

  chartOptions: any;
  filterForm!: FormGroup;
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

  ngOnInit() {
    this.initializeFilters();
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  // Initialize the filter form group
  initializeFilters() {
    this.filterForm = new FormGroup({
      agent: new FormControl(null),
      company: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
    });
  }

  // Filter the data based on selected criteria
  filterData() {
    this.filteredData = this.requestsData;

    const { agent, company, startDate, endDate } = this.filterForm.value;

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

  // Initialize the Nightingale chart with filtered data
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

    const data = Object.entries(groupedData).map(([type, value]) => ({
      name: type,
      value: value,
    }));

    this.chartOptions = {
      title: {
        text: 'Requests by Type (Nightingale)',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      polar: {
        radius: ['20%', '80%'], // Adjust to your preference
      },
      angleAxis: {
        type: 'category',
        data: data.map(item => item.name), // Categories (e.g., different types)
        startAngle: 90, // Start at the top of the circle
        clockwise: true, // Clockwise rotation
      },
      radiusAxis: {
        min: 0,
        max: Math.max(...data.map(item => item.value)), // Adjust radius scale based on data
      },
      series: [
        {
          name: 'Requests',
          type: 'bar',
          data: data.map(item => item.value), // Values for each category
          coordinateSystem: 'polar',
          itemStyle: {
            color: '#00C1DE', // Example color
          },
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
  loadData() {
    this.filterData(); // Apply any pre-existing filter
  }
}
