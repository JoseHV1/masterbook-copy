import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

export type ChartKey =
  // --- Agency dashboard ---
  | 'accounts'
  | 'requests'
  | 'quotes'
  | 'policies'
  | 'payments'
  | 'commissions'
  | 'clientPins'
  | 'summaryCards'

  // --- Admin dashboard ---
  | 'agenciesAddedTrend'
  | 'activeAgenciesTrend'
  | 'usageBreakdown';

export type Period = '7d' | '30d' | '90d' | '1year' | 'all';

export type ChartFiltersPayload = {
  chart: ChartKey;

  // ✅ new admin-friendly naming
  period: Period;
  agencyIds: string[];

  // ✅ legacy naming (keep old dashboards working)
  dateRange: string;
  agents: string[];
  companies: string[];
};

@Component({
  selector: 'app-chart-filters',
  templateUrl: './chart-filters.component.html',
  styleUrls: ['./chart-filters.component.scss'],
})
export class ChartsFiltersComponent {
  @Input() showDateRange = false;

  // legacy toggles
  @Input() showAgents = false;
  @Input() showCompanies = false;

  // ✅ new toggle for admin
  @Input() showAgencies = false;

  @Input() dateRanges: { label: string; value: string }[] = [];

  // legacy lists
  @Input() agents: any[] = [];
  @Input() insuranceCompanies: any[] = [];

  // ✅ admin list (you can reuse same {label,value} / {name,code} format you already have)
  @Input() agencies: any[] = [];

  @Input() chart!: ChartKey;

  // Use '30d' as a nicer default for admin, but keep legacy fallback in payload
  selectedDateRange: Period = '30d';

  // legacy selections
  selectedAgents: string[] = [];
  selectedCompanies: string[] = [];

  // ✅ admin selections
  selectedAgencies: string[] = [];

  @Output() filtersApplied = new EventEmitter<ChartFiltersPayload>();

  @ViewChild(MatMenuTrigger) menuTrigger?: MatMenuTrigger;

  private emit() {
    const period = (this.selectedDateRange || '30d') as Period;

    this.filtersApplied.emit({
      chart: this.chart,

      // new
      period,
      agencyIds: this.selectedAgencies ?? [],

      // legacy
      dateRange: period, // keep old code working
      agents: this.selectedAgents ?? [],
      companies: this.selectedCompanies ?? [],
    });

    this.menuTrigger?.closeMenu();
  }

  applyChartFilters() {
    this.emit();
  }

  resetFilters() {
    this.selectedDateRange = '30d';
    this.selectedAgents = [];
    this.selectedCompanies = [];
    this.selectedAgencies = [];

    this.filtersApplied.emit({
      chart: this.chart,

      period: '30d',
      agencyIds: [],

      dateRange: '30d',
      agents: [],
      companies: [],
    });

    this.menuTrigger?.closeMenu();
  }
}
