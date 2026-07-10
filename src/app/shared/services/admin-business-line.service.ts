import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { BusinessLineModel } from '../interfaces/models/business-line.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';

/** Read-only: Business Lines are managed elsewhere — this admin view only lists/searches them. */
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

  getFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Creation date',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
      ],
    };
  }
}
