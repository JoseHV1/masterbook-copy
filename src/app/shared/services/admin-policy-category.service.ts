import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import {
  CreatePolicyCategoryRequest,
  PolicyCategoryModel,
  UpdatePolicyCategoryRequest,
} from '../interfaces/models/policy-category.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AdminPolicyCategoryService {
  private readonly _base = `${environment.apiUrl}policy-category`;

  constructor(private readonly _http: HttpClient) {}

  getAll(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PolicyCategoryModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PolicyCategoryModel[]>>>(
        `${this._base}/list?page=${page}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getOne(id: string): Observable<PolicyCategoryModel> {
    return this._http
      .get<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  getBySerial(serial: string): Observable<PolicyCategoryModel> {
    return this._http
      .get<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/serial/${serial}`)
      .pipe(map(resp => resp.data));
  }

  create(req: CreatePolicyCategoryRequest): Observable<PolicyCategoryModel> {
    return this._http
      .post<ApiResponseModel<PolicyCategoryModel>>(this._base, req)
      .pipe(map(resp => resp.data));
  }

  update(id: string, req: UpdatePolicyCategoryRequest): Observable<PolicyCategoryModel> {
    return this._http
      .patch<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/${id}`, req)
      .pipe(map(resp => resp.data));
  }

  delete(id: string): Observable<PolicyCategoryModel> {
    return this._http
      .delete<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  removeFromTenants(id: string, tenant_ids: string[]): Observable<PolicyCategoryModel> {
    return this._http
      .patch<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/${id}/tenants/remove`, {
        tenant_ids,
      })
      .pipe(map(resp => resp.data));
  }

  updateTenantStatus(
    id: string,
    tenant_ids: string[],
    status: 'ACTIVE' | 'INACTIVE'
  ): Observable<PolicyCategoryModel> {
    return this._http
      .patch<ApiResponseModel<PolicyCategoryModel>>(`${this._base}/${id}/tenants/status`, {
        tenant_ids,
        status,
      })
      .pipe(map(resp => resp.data));
  }

  getAdminFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Creation date',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
        {
          label: 'Tenant',
          name: 'tenant_id',
          type: FilterTypeEnum.SELECT,
          options: of([]),
        },
      ],
    };
  }
}
