import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { HttpResponseModel } from '../models/response/http.response.model';
import { HttpFormatResponse } from '../models/response/http-format.response';
import { ApiService } from './api.service';

export type ClientPin = {
  client_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type AdminPeriod = '7d' | '30d' | '90d' | '1year' | 'all';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private _api: ApiService, private _http: HttpClient) {}
  /** ----------------- Utility Methods ------------------ */

  private buildParams(
    dateRange: string,
    agentIds?: string[] | null,
    insuranceCompanyIds?: string[] | null,
    startDate?: string | null,
    endDate?: string | null
  ): HttpParams {
    let params = new HttpParams().set('period', dateRange);

    if (dateRange === 'none' && startDate && endDate) {
      params = params.set('start_date', startDate).set('end_date', endDate);
    }

    if (agentIds?.length) {
      agentIds.forEach(id => {
        if (id) params = params.append('broker_id', id);
      });
    }

    if (insuranceCompanyIds?.length) {
      insuranceCompanyIds.forEach(id => {
        if (id) params = params.append('insurance_company_id', id);
      });
    }

    return params;
  }

  private defaultPagination(page = 1, size = 10): HttpParams {
    return new HttpParams()
      .set('page_number', page.toString())
      .set('docs_per_page', size.toString());
  }

  /** =========================================================
   * ================== AGENCY / BROKER DASHBOARD =============
   * ========================================================= */

  getSummaryCards(): Observable<HttpResponseModel<any>> {
    return this._api.get<HttpResponseModel<any>>('dashboard/summary-cards');
  }

  getClientPins(agent_id: string | null): Observable<ClientPin[]> {
    let params = new HttpParams();

    if (agent_id) {
      params = params.set('broker_id', agent_id);
    }

    return this._api
      .get<HttpResponseModel<ClientPin[]>>('dashboard/client-pins', params)
      .pipe(
        tap(res => {}),
        map(res => {
          const pins = res?.data ?? [];
          return pins;
        })
      );
  }

  getTotalAccounts(
    dateRange: string,
    agentIds: string[] | null,
    startDate: string | null,
    endDate: string | null
  ) {
    const params = this.buildParams(
      dateRange,
      agentIds,
      null,
      startDate,
      endDate
    );
    return this._api.get<HttpResponseModel<HttpFormatResponse<any>>>(
      'dashboard/account-trends',
      params
    );
  }

  getCommissionsTrend(
    dateRange: string,
    brokerIds: string[] = []
  ): Observable<HttpResponseModel<any>> {
    let params = new HttpParams().set('period', dateRange);

    brokerIds.forEach(id => {
      params = params.append('broker_ids', id);
    });

    return this._api.get<HttpResponseModel<any>>(
      'dashboard/commissions-trend',
      params
    );
  }

  getTotalRequests(
    dateRange: string,
    agentIds: string[] | null,
    insuranceCompanyIds: string[] | null,
    startDate: string | null,
    endDate: string | null
  ) {
    const params = this.buildParams(
      dateRange,
      agentIds,
      insuranceCompanyIds,
      startDate,
      endDate
    );
    return this._api.get<HttpResponseModel<HttpFormatResponse<any>>>(
      'dashboard/total-requests',
      params
    );
  }

  getTotalQuotes(
    dateRange: string,
    agentIds: string[] | null,
    insuranceCompanyIds: string[] | null,
    startDate: string | null,
    endDate: string | null
  ) {
    const params = this.buildParams(
      dateRange,
      agentIds,
      insuranceCompanyIds,
      startDate,
      endDate
    );
    return this._api.get<HttpResponseModel<HttpFormatResponse<any>>>(
      'dashboard/total-quotes',
      params
    );
  }

  /** =========================================================
   * ====================== ADMIN DASHBOARD ===================
   * ========================================================= */

  /**
   * ✅ Agencies dropdown list (for admin filters)
   *
   * Assumes you have an endpoint like:
   *   GET /agency
   * that returns a list in `data`.
   *
   * If your route is different (ex: 'agencies', 'admin/agencies'), change it here.
   */
  getAgenciesList(): Observable<HttpResponseModel<any>> {
    return this._api.get<HttpResponseModel<any>>(
      'dashboard/admin/filters/agencies'
    );
  }

  /**
   * GET /admin/dashboard/summary-cards
   * Optional: agency_ids=a,b,c
   */
  getAdminSummaryCards(
    agencyIds: string[] = []
  ): Observable<HttpResponseModel<any>> {
    let params = new HttpParams();

    if (agencyIds?.length) {
      params = params.set('agency_ids', agencyIds.join(','));
    }

    return this._api.get<HttpResponseModel<any>>(
      'dashboard/admin/summary-cards',
      params
    );
  }

  /**
   * GET /admin/dashboard/agencies-added-trend?period=90d&agency_ids=a,b
   */
  getAgenciesAddedTrend(
    period: AdminPeriod = '90d',
    agencyIds: string[] = []
  ): Observable<HttpResponseModel<any>> {
    let params = new HttpParams().set('period', period);

    if (agencyIds?.length) {
      params = params.set('agency_ids', agencyIds.join(','));
    }

    return this._api.get<HttpResponseModel<any>>(
      'dashboard/admin/agencies-added-trend',
      params
    );
  }

  /**
   * GET /admin/dashboard/active-agencies-trend?period=90d&agency_ids=a,b
   */
  getActiveAgenciesTrend(
    period: AdminPeriod = '90d',
    agencyIds: string[] = []
  ): Observable<HttpResponseModel<any>> {
    let params = new HttpParams().set('period', period);

    if (agencyIds?.length) {
      params = params.set('agency_ids', agencyIds.join(','));
    }

    return this._api.get<HttpResponseModel<any>>(
      'admin/dashboard/active-agencies-trend',
      params
    );
  }

  /**
   * GET /admin/dashboard/usage-breakdown?period=30d&agency_ids=a,b
   */
  getAdminUsageBreakdown(
    period: AdminPeriod = '30d',
    agencyIds: string[] = []
  ): Observable<HttpResponseModel<any>> {
    let params = new HttpParams().set('period', period);

    if (agencyIds?.length) {
      params = params.set('agency_ids', agencyIds.join(','));
    }

    return this._api.get<HttpResponseModel<any>>(
      'admin/dashboard/usage-breakdown',
      params
    );
  }

  /** ----------------- Employees ------------------ */

  getEmployees(page = 1, limit = 10, search?: string): Observable<any> {
    const params: any = { page, limit };

    if (search) {
      params.search = search;
    }

    return this._api.get<any>('broker', params);
  }

  /** ----------------- Insurance Companies ------------------ */

  getInsuranceCompanies(): Observable<
    HttpResponseModel<HttpFormatResponse<any>>
  > {
    const params = this.defaultPagination();
    return this._api.get<HttpResponseModel<HttpFormatResponse<any>>>(
      'insurer',
      params
    );
  }
}
