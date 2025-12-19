import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { AccountsModel } from '../models/DTO/account/accounts.model';
import { EmployeeModel } from '../models/DTO/employee/employee.model';
import { EmployeeBackEntity } from '../models/DTO/employee/employee.back-entity';
import { EmployeeDTO } from '../models/DTO/employee/employee.dto';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { PopulatedAccount } from '../interfaces/models/accounts.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { CreateAccountRequest } from '../interfaces/requests/accounts/create-account.request';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { AccountStatusEnum } from '../enums/account-status.enum';
import { UpdateAccountRequest } from '../interfaces/requests/accounts/update-account.request';
import { SetAccountStatusRequest } from '../interfaces/requests/accounts/set-account-status.request';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private _http: HttpClient) {}

  createAccount(req: CreateAccountRequest): Observable<PopulatedAccount> {
    return this._http
      .post<ApiResponseModel<PopulatedAccount>>(
        environment.apiUrl + 'account',
        req
      )
      .pipe(map(resp => resp.data));
  }

  getAccounts(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedAccount[]>> {
    pageIndex++;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedAccount[]>>>(
        environment.apiUrl +
          `account?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  setAccountStatus(
    id: string,
    req: SetAccountStatusRequest
  ): Observable<Record<string, string>> {
    return this._http
      .patch<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}account/set-status/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  resendInvitationEmail(id: string): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}account/resend-invitation-email/${id}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  getAccount(_id: string): Observable<PopulatedAccount> {
    return this._http
      .get<ApiResponseModel<PopulatedAccount>>(
        `${environment.apiUrl}account/${_id}`
      )
      .pipe(map(response => response.data));
  }

  getAccountBySerial(serial: string): Observable<PopulatedAccount> {
    return this._http
      .get<ApiResponseModel<PopulatedAccount>>(
        `${environment.apiUrl}account/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  updateAccount(
    id: string,
    req: UpdateAccountRequest
  ): Observable<PopulatedAccount> {
    return this._http
      .put<ApiResponseModel<PopulatedAccount>>(
        `${environment.apiUrl}account/${id}`,
        req
      )
      .pipe(map(response => response.data));
  }

  deleteAccount(_id: string): Observable<Record<string, string>> {
    return this._http
      .delete<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}account/${_id}`
      )
      .pipe(map(resp => resp.data));
  }

  getAccountsListFilters(): FilterWrapperModel {
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
          options: of(enumToDropDown(AccountStatusEnum)),
        },
        {
          label: 'Agent',
          name: 'broker_id',
          type: FilterTypeEnum.AGENT_SELECTOR,
        },
      ],
    };
  }

  //evaluar deprecados e ir eliminando al limpiar sus usos

  /**
   * @Deprecated Deprecated, se eliminaran progresivamente
   */
  getAccountById(id: string): Observable<HttpResponseModel<AccountsModel>> {
    return this._http.get<HttpResponseModel<AccountsModel>>(
      `${environment.apiUrl}account/${id}`
    );
  }

  /**
   * @Deprecated Deprecated, se eliminaran progresivamente
   */
  updateAccountStatus(accountId: string, statusName: string): Observable<any> {
    const url = `${environment.apiUrl}account/${accountId}/status?status_name=${statusName}`;
    return this._http.put(url, {});
  }
}
