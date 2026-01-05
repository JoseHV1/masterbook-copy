import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { FilterWrapperModel } from '../models/filters.model';
import { ClaimStatusEnum } from '../enums/claim-status.enum';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { ClaimModel } from '../models/claim.model';
import { PopulatedClaimModel } from '../interfaces/models/claims.model';
import { CreateClaimRequest } from '../interfaces/requests/claims/create-claim.request';

@Injectable({
  providedIn: 'root',
})
export class ClaimsService {
  maxDate: Date = new Date();
  today: Date = new Date();

  constructor(private _http: HttpClient) {
    this.maxDate.setFullYear(this.today.getFullYear() - 18);
  }

  getClaimsForm(): FormGroup {
    return new FormGroup({
      account_name: new FormControl(),
      policy_id: new FormControl(null, [Validators.required]),
      event_date: new FormControl(null, [Validators.required]),
      amount_requested: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      account: new FormControl(null, []),
      description: new FormControl(null, [Validators.maxLength(500)]),
    });
  }

  getClaims(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedClaimModel[]>> {
    pageIndex++;

    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedClaimModel[]>>>(
        environment.apiUrl +
          `claims?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getClaimsListFilters(): FilterWrapperModel {
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
          options: of(enumToDropDown(ClaimStatusEnum)),
        },
      ],
    };
  }

  changeStatus(id: string, status: string): Observable<ClaimModel> {
    return this._http
      .patch<ApiResponseModel<ClaimModel>>(
        environment.apiUrl + `claims/status/${id}/${status}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  createClaim(req: CreateClaimRequest): Observable<ClaimModel> {
    return this._http
      .post<ApiResponseModel<ClaimModel>>(environment.apiUrl + 'claims', req)
      .pipe(map(resp => resp.data));
  }

  updateClaim(
    id: string,
    payload: CreateClaimRequest
  ): Observable<PopulatedClaimModel> {
    return this._http
      .patch<ApiResponseModel<PopulatedClaimModel>>(
        `${environment.apiUrl}claims/${id}`,
        payload
      )
      .pipe(map(resp => resp.data));
  }

  deleteClaim(id: string): Observable<ClaimModel> {
    return this._http
      .delete<ApiResponseModel<ClaimModel>>(`${environment.apiUrl}claims/${id}`)
      .pipe(map(resp => resp.data));
  }

  getClaim(id: string): Observable<PopulatedClaimModel> {
    return this._http
      .get<ApiResponseModel<PopulatedClaimModel>>(
        `${environment.apiUrl}claims/${id}`
      )
      .pipe(map(resp => resp.data));
  }

  getClaimBySerial(serial: string): Observable<PopulatedClaimModel> {
    return this._http
      .get<ApiResponseModel<PopulatedClaimModel>>(
        `${environment.apiUrl}claims/serial/${serial}`
      )
      .pipe(map(resp => resp.data));
  }
}
