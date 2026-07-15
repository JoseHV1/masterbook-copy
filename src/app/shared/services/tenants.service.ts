import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { TenantModel } from '../interfaces/models/tenant.model';
import { TenantAdminModel } from '../interfaces/models/tenant-admin.model';
import { CreateTenantRequest } from '../interfaces/requests/tenants/create-tenant.request';
import { UpdateTenantRequest } from '../interfaces/requests/tenants/update-tenant.request';
import { CreateTenantAdminRequest } from '../interfaces/requests/tenants/create-tenant-admin.request';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { TenantStatusEnum } from '../enums/tenant-status.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  private readonly _base = `${environment.apiUrl}tenants`;

  constructor(private readonly _http: HttpClient) {}

  create(req: CreateTenantRequest): Observable<TenantModel> {
    return this._http
      .post<ApiResponseModel<TenantModel>>(this._base, req)
      .pipe(map(resp => resp.data));
  }

  getAll(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<TenantModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<TenantModel[]>>>(
        `${this._base}?page=${page}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(
        map(resp => resp.data),
        map(data => ({
          ...data,
          records: [...data.records].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
        }))
      );
  }

  getOne(serial: string): Observable<TenantModel> {
    return this._http
      .get<ApiResponseModel<TenantModel>>(`${this._base}/${serial}`)
      .pipe(map(resp => resp.data));
  }

  update(serial: string, req: UpdateTenantRequest): Observable<TenantModel> {
    return this._http
      .patch<ApiResponseModel<TenantModel>>(`${this._base}/${serial}`, req)
      .pipe(map(resp => resp.data));
  }

  enable(serial: string): Observable<TenantModel> {
    return this._http
      .patch<ApiResponseModel<TenantModel>>(`${this._base}/${serial}/enable`, {})
      .pipe(map(resp => resp.data));
  }

  disable(serial: string): Observable<TenantModel> {
    return this._http
      .patch<ApiResponseModel<TenantModel>>(`${this._base}/${serial}/disable`, {})
      .pipe(map(resp => resp.data));
  }

  hardDelete(serial: string): Observable<void> {
    return this._http
      .delete<ApiResponseModel<void>>(`${this._base}/${serial}`)
      .pipe(map(resp => resp.data));
  }

  softDelete(serial: string): Observable<TenantModel> {
    return this._http
      .patch<ApiResponseModel<TenantModel>>(`${this._base}/${serial}/soft-delete`, {})
      .pipe(map(resp => resp.data));
  }

  getPublic(): Observable<{ name: string; code: string }[]> {
    return this._http
      .get<ApiResponseModel<{ name: string; code: string }[]>>(`${this._base}/public`)
      .pipe(
        map(resp => resp.data),
        map(tenants => [...tenants].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')))
      );
  }

  getAdmins(serial: string): Observable<TenantAdminModel[]> {
    return this._http
      .get<ApiResponseModel<TenantAdminModel[]>>(`${this._base}/${serial}/admins`)
      .pipe(map(resp => resp.data));
  }

  createAdmin(serial: string, req: CreateTenantAdminRequest): Observable<TenantAdminModel> {
    return this._http
      .post<ApiResponseModel<TenantAdminModel>>(`${this._base}/${serial}/admins`, req)
      .pipe(map(resp => resp.data));
  }

  getForCurrentAgency(): Observable<TenantModel | null> {
    return this._http
      .get<ApiResponseModel<TenantModel | null>>(`${this._base}/agency-tenant`)
      .pipe(
        map(resp => resp.data),
        catchError(() => of(null)),
      );
  }

  getTenantFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Status',
          name: 'status',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(TenantStatusEnum)),
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
