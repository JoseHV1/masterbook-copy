import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { HttpFormatResponse } from '../models/response/http-format.response';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { ApiService } from './api.service';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { CommissionStatusEnum } from '../enums/commission-status.enum';
import { SearchCheckCommissionConfig } from '../interfaces/models/search-check-commission-config';
import {
  CommissionModel,
  PopulatedCommisionModel,
} from '../interfaces/models/commisions.model';
import { RolesEnum } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class CommissionsService {
  maxDate: Date = new Date();
  today: Date = new Date();

  constructor(private _api: ApiService, private _http: HttpClient) {
    this.maxDate.setFullYear(this.today.getFullYear() - 18);
  }

  getCommissions(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedCommisionModel[]>> {
    pageIndex++;

    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedCommisionModel[]>>>(
        environment.apiUrl +
          `commissions?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getCommissionsListFilters(role: string): FilterWrapperModel {
    const filters = [
      {
        label: 'Creation date',
        name: 'created_at_date',
        type: FilterTypeEnum.DATE_RANGE,
      },
      {
        label: 'Status',
        name: 'status',
        type: FilterTypeEnum.MULTISELECT,
        options: of(enumToDropDown(CommissionStatusEnum)),
      },
      {
        label: 'Agent',
        name: 'broker_id',
        type: FilterTypeEnum.AGENT_SELECTOR,
      },
    ];

    const filteredFilters = filters.filter(f => {
      if (role === RolesEnum.AGENCY_BROKER && f.name === 'broker_id') {
        return false;
      }
      return true;
    });

    return {
      filters: filteredFilters,
    };
  }

  updateCommissionStatus(
    commissionId: string,
    status: CommissionStatusEnum
  ): Observable<CommissionModel> {
    return this._http
      .patch<ApiResponseModel<CommissionModel>>(
        environment.apiUrl + `commissions/${commissionId}`,
        { status }
      )
      .pipe(map(resp => resp.data));
  }

  getCommissionById(id: string): Observable<PopulatedCommisionModel> {
    return this._http
      .get<HttpResponseModel<PopulatedCommisionModel>>(
        `${environment.apiUrl}commissions/${id}`
      )
      .pipe(map(response => response.data));
  }

  deleteOneCommission(id: string): Observable<HttpResponseModel<any>> {
    return this._http.delete<HttpResponseModel<any>>(
      `${environment.apiUrl}commissions/${id}`
    );
  }

  checkCommissionExists(
    search: SearchCheckCommissionConfig
  ): Observable<boolean> {
    return this._http
      .post<{ data: boolean }>(
        `${environment.apiUrl}commission-config/check-config-exists`,
        search
      )
      .pipe(map(res => res.data));
  }
}
