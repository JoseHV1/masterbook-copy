import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { StripeBillingModel } from '../interfaces/models/stripe-billing.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { StripeBillingStatusEnum } from '../enums/stripe-billing-status.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';

@Injectable({
  providedIn: 'root',
})
export class StripeBillingService {
  private readonly _base = `${environment.apiUrl}stripe-billing`;

  constructor(private readonly _http: HttpClient) {}

  getAll(
    pageIndex: number,
    pageSize: number,
    filters?: string,
  ): Observable<PaginatedResponse<StripeBillingModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<StripeBillingModel[]>>>(
        `${this._base}?page=${page}&limit=${pageSize}${filters ?? ''}`,
      )
      .pipe(map(resp => resp.data));
  }

  getOne(serial: string): Observable<StripeBillingModel> {
    return this._http
      .get<ApiResponseModel<StripeBillingModel>>(`${this._base}/${serial}`)
      .pipe(map(resp => resp.data));
  }

  getFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Status',
          name: 'status',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(StripeBillingStatusEnum)),
        },
        {
          label: 'Date range',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
      ],
    };
  }
}
