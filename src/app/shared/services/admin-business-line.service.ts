import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import {
  BusinessLineModel,
  CreateBusinessLineRequest,
  UpdateBusinessLineRequest,
} from '../interfaces/models/business-line.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AdminBusinessLineService {
  private readonly _base = `${environment.apiUrl}business-lines`;

  constructor(private readonly _http: HttpClient) {}

  getAll(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<BusinessLineModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<BusinessLineModel[]>>>(
        `${this._base}/list?page=${page}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getOne(id: string): Observable<BusinessLineModel> {
    return this._http
      .get<ApiResponseModel<BusinessLineModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  getBySerial(serial: string): Observable<BusinessLineModel> {
    return this._http
      .get<ApiResponseModel<BusinessLineModel>>(`${this._base}/serial/${serial}`)
      .pipe(map(resp => resp.data));
  }

  create(req: CreateBusinessLineRequest): Observable<BusinessLineModel> {
    return this._http
      .post<ApiResponseModel<BusinessLineModel>>(this._base, req)
      .pipe(map(resp => resp.data));
  }

  update(id: string, req: UpdateBusinessLineRequest): Observable<BusinessLineModel> {
    return this._http
      .patch<ApiResponseModel<BusinessLineModel>>(`${this._base}/${id}`, req)
      .pipe(map(resp => resp.data));
  }

  delete(id: string): Observable<BusinessLineModel> {
    return this._http
      .delete<ApiResponseModel<BusinessLineModel>>(`${this._base}/${id}`)
      .pipe(map(resp => resp.data));
  }

  removeFromTenants(id: string, tenant_ids: string[]): Observable<BusinessLineModel> {
    return this._http
      .patch<ApiResponseModel<BusinessLineModel>>(`${this._base}/${id}/tenants/remove`, {
        tenant_ids,
      })
      .pipe(map(resp => resp.data));
  }

  updateTenantStatus(
    id: string,
    tenant_ids: string[],
    status: 'ACTIVE' | 'INACTIVE'
  ): Observable<BusinessLineModel> {
    return this._http
      .patch<ApiResponseModel<BusinessLineModel>>(`${this._base}/${id}/tenants/status`, {
        tenant_ids,
        status,
      })
      .pipe(map(resp => resp.data));
  }

  getFilters(): FilterWrapperModel {
    return this.getAdminFilters();
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
