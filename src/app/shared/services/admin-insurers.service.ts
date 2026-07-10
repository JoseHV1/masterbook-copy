import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { InsurerModel, CreateInsurerRequest, UpdateInsurerRequest } from '../interfaces/models/insurer.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { InsuranceCompanyStatus } from '../enums/insurance-company-status.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';

@Injectable({
  providedIn: 'root',
})
export class AdminInsurersService {
  private readonly _base = `${environment.apiUrl}insurer`;

  constructor(private readonly _http: HttpClient) {}

  getAll(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<InsurerModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<InsurerModel[]>>>(
        `${this._base}/admin/list?page=${page}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getOne(id: string): Observable<InsurerModel> {
    return this._http
      .get<ApiResponseModel<InsurerModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  getBySerial(serial: string): Observable<InsurerModel> {
    return this._http
      .get<ApiResponseModel<InsurerModel>>(`${this._base}/serial/${serial}`)
      .pipe(map(resp => resp.data));
  }

  create(req: CreateInsurerRequest): Observable<InsurerModel> {
    return this._http
      .post<ApiResponseModel<InsurerModel>>(this._base, req)
      .pipe(map(resp => resp.data));
  }

  update(id: string, req: UpdateInsurerRequest): Observable<InsurerModel> {
    return this._http
      .patch<ApiResponseModel<InsurerModel>>(`${this._base}/${id}`, req)
      .pipe(map(resp => resp.data));
  }

  delete(id: string): Observable<InsurerModel> {
    return this._http
      .delete<ApiResponseModel<InsurerModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  enable(id: string): Observable<InsurerModel> {
    return this._http
      .patch<ApiResponseModel<InsurerModel>>(`${this._base}/${id}/enable`, {})
      .pipe(map(resp => resp.data));
  }

  disable(id: string): Observable<InsurerModel> {
    return this._http
      .patch<ApiResponseModel<InsurerModel>>(`${this._base}/${id}/disable`, {})
      .pipe(map(resp => resp.data));
  }

  removeFromTenants(id: string, tenant_ids: string[]): Observable<InsurerModel> {
    return this._http
      .patch<ApiResponseModel<InsurerModel>>(`${this._base}/${id}/tenants/remove`, {
        tenant_ids,
      })
      .pipe(map(resp => resp.data));
  }

  updateTenantStatus(
    id: string,
    tenant_ids: string[],
    status: 'ACTIVE' | 'INACTIVE'
  ): Observable<InsurerModel> {
    return this._http
      .patch<ApiResponseModel<InsurerModel>>(`${this._base}/${id}/tenants/status`, {
        tenant_ids,
        status,
      })
      .pipe(map(resp => resp.data));
  }

  getAdminFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Status',
          name: 'status',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(InsuranceCompanyStatus)),
        },
        {
          label: 'Creation date',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
      ],
    };
  }
}
