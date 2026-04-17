import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from 'src/app/shared/interfaces/models/api-response.model';
import { LeadModel } from '../interfaces/lead.model';
import { LeadTokenInfoModel } from '../interfaces/lead-token-info.model';
import { CreateLeadRequest } from '../interfaces/requests/create-lead.request';
import { TransferLeadRequest } from '../interfaces/requests/transfer-lead.request';
import { AgencyWithTokenModel } from '../interfaces/agency-with-token.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { CaptureMediumEnum } from '../enums/capture-medium.enum';
import { AreaOfInterestEnum } from '../enums/area-of-interest.enum';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  constructor(private _http: HttpClient) {}

  getLeadByToken(token: string): Observable<LeadTokenInfoModel> {
    return this._http
      .get<ApiResponseModel<LeadTokenInfoModel>>(
        `${environment.apiUrl}leads/${token}`
      )
      .pipe(map(resp => resp.data));
  }

  createLead(req: CreateLeadRequest, token: string): Observable<LeadModel> {
    return this._http
      .post<ApiResponseModel<LeadModel>>(
        `${environment.apiUrl}leads/${token}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  generateUrlLeads(): Observable<void> {
    return this._http
      .post<ApiResponseModel<void>>(
        `${environment.apiUrl}auth/generate-token-leads`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  getLeadBySerial(serial: string): Observable<LeadModel> {
    return this._http
      .get<ApiResponseModel<LeadModel>>(
        `${environment.apiUrl}leads/serial/${serial}`
      )
      .pipe(map(resp => resp.data));
  }

  getLeads(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<LeadModel[]>> {
    const page = pageIndex + 1;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<LeadModel[]>>>(
        `${environment.apiUrl}leads?page=${page}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getAgenciesWithToken(): Observable<AgencyWithTokenModel[]> {
    return this._http
      .get<ApiResponseModel<AgencyWithTokenModel[]>>(
        `${environment.apiUrl}leads/agencies`
      )
      .pipe(map(resp => resp.data));
  }

  transferLead(serial: string, req: TransferLeadRequest): Observable<void> {
    return this._http
      .post<ApiResponseModel<void>>(
        `${environment.apiUrl}leads/transfer/${serial}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  rejectLead(serial: string): Observable<void> {
    return this._http
      .patch<ApiResponseModel<void>>(
        `${environment.apiUrl}leads/reject/${serial}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  getLeadListFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Creation date',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
        {
          label: 'Capture medium',
          name: 'capture_medium',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(CaptureMediumEnum)),
        },
        {
          label: 'Area of interest',
          name: 'area_of_interest',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(AreaOfInterestEnum)),
        },
      ],
    };
  }
}
