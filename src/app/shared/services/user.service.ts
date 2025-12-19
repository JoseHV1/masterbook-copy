import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpResponseModel } from '../models/response/http.response.model';
import { CreateBrokerRequest } from '../interfaces/requests/broker/create-broker.request';
import { PopulatedBrokerModel } from '../interfaces/models/broker.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { BrokerStatusEnum } from '../enums/broker-status.enum';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { AgencyBrokerRolesEnum } from '../enums/roles.enum';
import { SetBrokerStatusRequest } from '../interfaces/requests/broker/set-broker-status.request';
import { UpdateBrokerRequest } from '../interfaces/requests/broker/update-broker.request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  createUser(req: CreateBrokerRequest): Observable<PopulatedBrokerModel> {
    return this._http
      .post<ApiResponseModel<PopulatedBrokerModel>>(
        environment.apiUrl + 'broker',
        req
      )
      .pipe(map(resp => resp.data));
  }

  getUsers(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedBrokerModel[]>> {
    pageIndex++;
    return this._http
      .get<HttpResponseModel<PaginatedResponse<PopulatedBrokerModel[]>>>(
        environment.apiUrl +
          `broker?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(
        map(response => {
          return response.data;
        })
      );
  }

  setUserStatus(
    id: string,
    req: SetBrokerStatusRequest
  ): Observable<PopulatedBrokerModel> {
    return this._http
      .patch<ApiResponseModel<PopulatedBrokerModel>>(
        `${environment.apiUrl}broker/set-status/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  resendInvitationEmail(id: string): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}broker/resend-invitation-email/${id}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  getUser(id: string): Observable<PopulatedBrokerModel> {
    return this._http
      .get<ApiResponseModel<PopulatedBrokerModel>>(
        `${environment.apiUrl}broker/${id}`
      )
      .pipe(map(response => response.data));
  }

  getUserBySerial(serial: string): Observable<PopulatedBrokerModel> {
    return this._http
      .get<ApiResponseModel<PopulatedBrokerModel>>(
        `${environment.apiUrl}broker/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  updateUser(
    id: string,
    req: UpdateBrokerRequest
  ): Observable<PopulatedBrokerModel> {
    return this._http
      .put<ApiResponseModel<PopulatedBrokerModel>>(
        `${environment.apiUrl}broker/${id}`,
        req
      )
      .pipe(map(response => response.data));
  }

  deleteUser(_id: string): Observable<Record<string, string>> {
    return this._http
      .delete<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}broker/${_id}`
      )
      .pipe(map(resp => resp.data));
  }

  getUsersListFilters(): FilterWrapperModel {
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
          options: of(enumToDropDown(BrokerStatusEnum)),
        },
        {
          label: 'User type',
          name: 'role',
          type: FilterTypeEnum.MULTISELECT,
          options: of(enumToDropDown(AgencyBrokerRolesEnum)),
        },
      ],
    };
  }

  getBrokerById(id: string): Observable<ApiResponseModel<any>> {
    return this._http
      .get<ApiResponseModel<any>>(`${environment.apiUrl}broker/${id}`)
      .pipe(map(resp => resp.data));
  }

  //evaluar deprecados e ir eliminando al limpiar sus usos

  /**
   * @Deprecated Deprecated, se eliminaran progresivamente
   */
  getUserById(id: string): Observable<HttpResponseModel<any>> {
    return this._http
      .get<HttpResponseModel<any>>(`${environment.apiUrl}brokers/${id}`)
      .pipe(
        // tap(response => console.log('Response:', response)),
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => error);
        })
      );
  }
}
