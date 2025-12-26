import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export type ChartKey =
  | 'accounts'
  | 'requests'
  | 'quotes'
  | 'policies'
  | 'payments'
  | 'commissions';

@Component({
  selector: 'app-chart-filters',
  templateUrl: './chart-filters.component.html',
  styleUrls: ['./chart-filters.component.scss'],
})
export class ChartsFiltersComponent {
  @Input() showDateRange = false;
  @Input() showAgents = false;
  @Input() showCompanies = false;

  @Input() dateRanges: any[] = [];
  @Input() agents: any[] = [];
  @Input() insuranceCompanies: any[] = [];
  @Input() chart!: ChartKey;

  selectedDateRange: string = '7d'; // single
  selectedAgents: string[] = []; // multi
  selectedCompanies: string[] = []; // multi

  @Output() filtersApplied = new EventEmitter<{
    dateRange: string;
    agents: string[];
    companies: string[];
    chart: ChartKey;
  }>();

  @ViewChild(MatMenuTrigger) menuTrigger?: MatMenuTrigger;

  applyChartFilters() {
    this.filtersApplied.emit({
      dateRange: this.selectedDateRange || '7d',
      agents: this.selectedAgents ?? [],
      companies: this.selectedCompanies ?? [],
      chart: this.chart,
    });

    this.menuTrigger?.closeMenu();
  }

  resetFilters() {
    this.selectedDateRange = '7d';
    this.selectedAgents = [];
    this.selectedCompanies = [];

    this.filtersApplied.emit({
      dateRange: '7d',
      agents: [],
      companies: [],
      chart: this.chart,
    });

    this.menuTrigger?.closeMenu();
  }
}
