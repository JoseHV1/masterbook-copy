import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

import {
  DashboardService,
  AdminPeriod,
} from '../../shared/services/dashboard.service';
import { UiService } from '@app/shared/services/ui.service';
import { ChartFiltersPayload } from '@app/portal/activities/components/chart-filters/chart-filters.component'; // adjust path if needed

export type AdminChartKey =
  | 'summaryCards'
  | 'agenciesAddedTrend'
  | 'activeAgenciesTrend'
  | 'usageBreakdown';

type TrendPoint = { day?: string; month?: string; count: number };

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  agenciesList: { code: string; name: string }[] = [];

  // labels shown under titles
  selectedDateRange: Record<AdminChartKey, string> = {
    summaryCards: 'Last 30 days',
    agenciesAddedTrend: 'Last 90 days',
    activeAgenciesTrend: 'Last 90 days',
    usageBreakdown: 'Last 30 days',
  };

  dateRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Last year', value: '1year' },
    { label: 'All time', value: 'all' },
  ];

  // --- responses ---
  adminTotals: any;
  agenciesAddedTrend: TrendPoint[] = [];
  usageBreakdown: any;
  activeAgenciesTrend: TrendPoint[] = [];

  constructor(private _dashboard: DashboardService, private _ui: UiService) {}

  ngOnInit(): void {
    this.loadAgencies();

    // initial loads
    this.fetchChartData('summaryCards', '30d', []);
    this.fetchChartData('agenciesAddedTrend', '90d', []);
    this.fetchChartData('activeAgenciesTrend', '90d', []);
    this.fetchChartData('usageBreakdown', '30d', []);
  }

  private loadAgencies(): void {
    this._dashboard.getAgenciesList().subscribe({
      next: (resp: any) => {
        console.log('Agencies list response:', resp);
        const rows = resp?.data ?? resp ?? [];
        this.agenciesList = (rows ?? []).map((a: any) => ({
          code: a._id ?? a.id ?? a.code,
          name: a.name ?? a.agency_name ?? a.title ?? 'Agency',
        }));
      },
      error: () => {
        this.agenciesList = [];
      },
    });
  }

  fetchChartData(
    chart: AdminChartKey,
    period: AdminPeriod = '30d',
    agencyIds: string[] = []
  ) {
    this.selectedDateRange[chart] =
      this.dateRanges.find(r => r.value === period)?.label ?? period;

    this._ui.showLoader();

    switch (chart) {
      case 'summaryCards':
        return this._dashboard
          .getAdminSummaryCards(agencyIds)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.adminTotals = resp?.data ?? resp;
          });

      case 'agenciesAddedTrend':
        return this._dashboard
          .getAgenciesAddedTrend(period, agencyIds)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.agenciesAddedTrend = (resp?.data ??
              resp ??
              []) as TrendPoint[];
          });

      case 'activeAgenciesTrend':
        return this._dashboard
          .getActiveAgenciesTrend(period, agencyIds)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.activeAgenciesTrend = (resp?.data ??
              resp ??
              []) as TrendPoint[];
          });

      case 'usageBreakdown':
        return this._dashboard
          .getAdminUsageBreakdown(period, agencyIds)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.usageBreakdown = resp?.data ?? resp;
          });

      default:
        this._ui.hideLoader();
        console.error(`No fetch function found for chart: ${chart}`);
        return;
    }
  }

  onFiltersApplied(filters: ChartFiltersPayload) {
    // admin template only emits admin chart keys, so this is safe
    const chart = filters.chart as AdminChartKey;
    this.fetchChartData(chart, filters.period, filters.agencyIds);
  }
}
