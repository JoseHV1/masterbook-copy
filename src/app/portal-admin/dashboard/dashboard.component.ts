import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, skip, Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import {
  DashboardService,
  AdminPeriod,
} from '../../shared/services/dashboard.service';
import { UiService } from '@app/shared/services/ui.service';
import { AdminTenantContextService } from '@app/shared/services/admin-tenant-context.service';
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
export class DashboardComponent implements OnInit, OnDestroy {
  agenciesList: { code: string; name: string }[] = [];

  // labels shown under titles
  selectedDateRange: Record<AdminChartKey, string> = {
    summaryCards: '',
    agenciesAddedTrend: '',
    activeAgenciesTrend: '',
    usageBreakdown: '',
  };

  dateRanges: { label: string; value: string }[] = [];

  // --- responses ---
  adminTotals: any;
  agenciesAddedTrend: TrendPoint[] = [];
  usageBreakdown: any;
  activeAgenciesTrend: TrendPoint[] = [];

  private _lastFilters: Record<
    AdminChartKey,
    { period: AdminPeriod; agencyIds: string[] }
  > = {
    summaryCards: { period: '30d', agencyIds: [] },
    agenciesAddedTrend: { period: '90d', agencyIds: [] },
    activeAgenciesTrend: { period: '90d', agencyIds: [] },
    usageBreakdown: { period: '30d', agencyIds: [] },
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _dashboard: DashboardService,
    private _ui: UiService,
    private _adminCtx: AdminTenantContextService,
    private _t: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadAgencies();

    this.fetchChartData('summaryCards', '30d', []);
    this.fetchChartData('agenciesAddedTrend', '90d', []);
    this.fetchChartData('activeAgenciesTrend', '90d', []);
    this.fetchChartData('usageBreakdown', '30d', []);

    this._t
      .get([
        'PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_7_DAYS',
        'PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_30_DAYS',
        'PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_90_DAYS',
        'PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_YEAR',
        'PORTAL.PORTAL_ADMIN.DASHBOARD.ALL_TIME',
      ])
      .pipe(takeUntil(this._destroy$))
      .subscribe(translations => {
        this.dateRanges = [
          { label: translations['PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_7_DAYS'], value: '7d' },
          { label: translations['PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_30_DAYS'], value: '30d' },
          { label: translations['PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_90_DAYS'], value: '90d' },
          { label: translations['PORTAL.PORTAL_ADMIN.DASHBOARD.LAST_YEAR'], value: '1year' },
          { label: translations['PORTAL.PORTAL_ADMIN.DASHBOARD.ALL_TIME'], value: 'all' },
        ];

        (Object.keys(this._lastFilters) as AdminChartKey[]).forEach(chart => {
          const { period } = this._lastFilters[chart];
          this.selectedDateRange[chart] =
            this.dateRanges.find(r => r.value === period)?.label ?? period;
        });
      });

    this._adminCtx.tenant$
      .pipe(skip(1), takeUntil(this._destroy$))
      .subscribe(() => {
        (Object.keys(this._lastFilters) as AdminChartKey[]).forEach(chart => {
          const { period, agencyIds } = this._lastFilters[chart];
          this.fetchChartData(chart, period, agencyIds);
        });
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private loadAgencies(): void {
    this._dashboard.getAgenciesList().subscribe({
      next: (resp: any) => {
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
    this._lastFilters[chart] = { period, agencyIds };

    const tenantId = this._adminCtx.snapshot?._id;

    this._ui.showLoader();

    switch (chart) {
      case 'summaryCards':
        return this._dashboard
          .getAdminSummaryCards(agencyIds, tenantId)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.adminTotals = resp?.data ?? resp;
          });

      case 'agenciesAddedTrend':
        return this._dashboard
          .getAgenciesAddedTrend(period, agencyIds, tenantId)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.agenciesAddedTrend = (resp?.data ??
              resp ??
              []) as TrendPoint[];
          });

      case 'activeAgenciesTrend':
        return this._dashboard
          .getActiveAgenciesTrend(period, agencyIds, tenantId)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe((resp: any) => {
            this.activeAgenciesTrend = (resp?.data ??
              resp ??
              []) as TrendPoint[];
          });

      case 'usageBreakdown':
        return this._dashboard
          .getAdminUsageBreakdown(period, agencyIds, tenantId)
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
