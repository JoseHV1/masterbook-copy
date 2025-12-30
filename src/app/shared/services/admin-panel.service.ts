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

  getAdminListFilters(): FilterWrapperModel {
    return {
      filters: [
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
      ],
    };
  }
}
