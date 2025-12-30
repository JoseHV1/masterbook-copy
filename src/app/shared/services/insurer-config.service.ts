import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { InsurerModel } from '../interfaces/models/insurer.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { InsuranceCompanyStatus } from '../enums/insurance-company-status.enum';
import { ConfigInsurerRequest } from '../interfaces/requests/insurer/config-insurer.request';
import { CommissionConfigModel } from '../interfaces/models/commission-config.model';

@Injectable({
  providedIn: 'root',
})
export class InsurerConfigService {
  constructor(private _http: HttpClient) {}

  getInsurers(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<InsurerModel[]>> {
    pageIndex++;
    return this._http
      .get<HttpResponseModel<PaginatedResponse<InsurerModel[]>>>(
        environment.apiUrl +
          `insurer/list?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(
        map(response => {
          return response.data;
        })
      );
  }

  getInsurersWithConfig(): Observable<InsurerModel[]> {
    return this._http
      .get<HttpResponseModel<InsurerModel[]>>(
        environment.apiUrl + `insurer/list/config`
      )
      .pipe(
        map(response => {
          return response.data;
        })
      );
  }

  getInsurer(id: string): Observable<InsurerModel> {
    return this._http
      .get<HttpResponseModel<InsurerModel>>(
        `${environment.apiUrl}insurer/${id}`
      )
      .pipe(map(response => response.data));
  }

  getInsurerBySerial(serial: string): Observable<InsurerModel> {
    return this._http
      .get<HttpResponseModel<InsurerModel>>(
        `${environment.apiUrl}insurer/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  getInsurerConfigs(id: string): Observable<CommissionConfigModel[]> {
    return this._http
      .get<HttpResponseModel<CommissionConfigModel[]>>(
        `${environment.apiUrl}insurer/${id}/configs`
      )
      .pipe(map(response => response.data));
  }

  configInsurer(id: string, request: ConfigInsurerRequest): Observable<any> {
    return this._http
      .patch<HttpResponseModel<any>>(
        `${environment.apiUrl}insurer/config/${id}`,
        request
      )
      .pipe(map(response => response.data));
  }

  getInsurerListFilters(): FilterWrapperModel {
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
          type: FilterTypeEnum.MULTISELECT,
          options: of(enumToDropDown(InsuranceCompanyStatus)),
        },
      ],
    };
  }
}
