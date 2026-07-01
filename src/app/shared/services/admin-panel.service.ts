import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { CompleteRegisterRolesEnum } from '../enums/roles.enum';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { HttpResponseModel } from '../models/response/http.response.model';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { AgencyPaymentStatusEnum } from '../enums/agency-payment-status';
import { TenantModel } from '../interfaces/models/tenant.model';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  constructor(private readonly _http: HttpClient) {}

  getClients(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<any[]>> {
    pageIndex++;
    return this._http
      .get<HttpResponseModel<any>>(
        environment.apiUrl +
          `admin-panel/clients-list?page=${pageIndex}&limit=${pageSize}${
            filters ?? ''
          }`
      )
      .pipe(
        map(response => {
          return response.data.data;
        })
      );
  }

  getClient(serial: string): Observable<any> {
    return this._http
      .get<ApiResponseModel<any>>(
        `${environment.apiUrl}admin-panel/client-details/${serial}`
      )
      .pipe(map(response => response.data));
  }

  createAgency(data: any): Observable<{ result: string; billing_mode: string }> {
    return this._http
      .post<ApiResponseModel<{ result: string; billing_mode: string }>>(
        `${environment.apiUrl}admin-panel/agencies`,
        data
      )
      .pipe(map(response => response.data));
  }

  createIndependentBroker(data: any): Observable<{ result: string; billing_mode: string }> {
    return this._http
      .post<ApiResponseModel<{ result: string; billing_mode: string }>>(
        `${environment.apiUrl}admin-panel/independent-brokers`,
        data
      )
      .pipe(map(response => response.data));
  }

  changeBillingMode(agencyId: string, billing_mode: string): Observable<{ result: string }> {
    return this._http
      .patch<ApiResponseModel<{ result: string }>>(
        `${environment.apiUrl}admin-panel/agencies/${agencyId}/billing-mode`,
        { billing_mode }
      )
      .pipe(map(response => response.data));
  }

  getAuditLog(agencyId: string): Observable<any[]> {
    return this._http
      .get<ApiResponseModel<any[]>>(
        `${environment.apiUrl}admin-panel/agencies/${agencyId}/audit-log`
      )
      .pipe(map(response => response.data));
  }

  getAdminListFilters(tenants: TenantModel[] = []): FilterWrapperModel {
    const baseFilters: any[] = [
      {
        label: 'Creation date',
        name: 'created_at_date',
        type: FilterTypeEnum.DATE_RANGE,
      },
      {
        label: 'Status',
        name: 'status',
        type: FilterTypeEnum.SELECT,
        options: of(enumToDropDown(AgencyPaymentStatusEnum)),
      },
      {
        label: 'Entity type',
        name: 'role',
        type: FilterTypeEnum.SELECT,
        options: of(enumToDropDown(CompleteRegisterRolesEnum)),
      },
    ];

    // Solo agrega el filtro de tenant si hay tenants disponibles
    if (tenants.length > 0) {
      baseFilters.push({
        label: 'Tenant (Country)',
        name: 'tenant_id',
        type: FilterTypeEnum.SELECT,
        options: of(
          tenants.map(t => ({ name: `${t.name} (${t.code})`, code: t._id }))
        ),
      });
    }

    return { filters: baseFilters };
  }
}
