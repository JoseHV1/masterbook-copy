import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { HttpFormatResponse } from '../models/response/http-format.response';
import {
  QuoteRequestModel,
  QuoteRequestResponseModel,
} from '../models/quotes-request.model';
import { HttpResponseModel } from '../models/response/http.response.model';
import { RequestDetailsModel } from '../models/DTO/request-details/request-details.model';
import { RequestDetailsBackendEntity } from '../models/DTO/request-details/request-details.back-entity';
import { RequestDetailsDTO } from '../models/DTO/request-details/request-details.dto';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { CreateRequestRequest } from '../interfaces/requests/requests/create-request.request';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import {
  PopulatedRequestModel,
  RequestModel,
} from '../interfaces/models/request.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { PolicyCategoryEnum } from '../enums/policy-category.enum';
import { RequestStatusEnum } from '../enums/request-status.enum';
import { DatasetsService } from './dataset.service';
import { UpdateRequestRequest } from '../interfaces/requests/requests/update-request.request';
import { RejectRequestRequest } from '../interfaces/requests/requests/reject-request.request';
import { AuthModel } from '../interfaces/models/auth.model';
import { PopulatedUserModel } from '../interfaces/models/user.model';
import { RolesEnum } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private _http: HttpClient, private _dataset: DatasetsService) {}

  createRequest(req: CreateRequestRequest): Observable<RequestModel> {
    return this._http
      .post<ApiResponseModel<RequestModel>>(environment.apiUrl + 'request', req)
      .pipe(map(resp => resp.data));
  }

  getRequests(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedRequestModel[]>> {
    pageIndex++;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedRequestModel[]>>>(
        environment.apiUrl +
          `request?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getRequest(_id: string): Observable<PopulatedRequestModel> {
    return this._http
      .get<ApiResponseModel<PopulatedRequestModel>>(
        `${environment.apiUrl}request/${_id}`
      )
      .pipe(map(response => response.data));
  }

  getRequestBySerial(serial: string): Observable<PopulatedRequestModel> {
    return this._http
      .get<ApiResponseModel<PopulatedRequestModel>>(
        `${environment.apiUrl}request/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  editRequest(req: UpdateRequestRequest, id: string): Observable<RequestModel> {
    return this._http
      .put<ApiResponseModel<RequestModel>>(
        `${environment.apiUrl}request/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  deleteRequest(_id: string): Observable<Record<string, string>> {
    return this._http
      .delete<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}request/${_id}`
      )
      .pipe(map(resp => resp.data));
  }

  rejectRequest(
    req: RejectRequestRequest,
    id: string
  ): Observable<RequestModel> {
    return this._http
      .patch<ApiResponseModel<RequestModel>>(
        `${environment.apiUrl}request/reject/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  // getRequestsListFilters(role: string): FilterWrapperModel {
  //   const isInsured = role === RolesEnum.INSURED;

  //   const allFilters = [
  //     {
  //       label: 'Creation date',
  //       name: 'created_at_date',
  //       type: FilterTypeEnum.DATE_RANGE,
  //     },
  //     {
  //       label: 'Status',
  //       name: 'status',
  //       type: FilterTypeEnum.MULTISELECT,
  //       options: of(enumToDropDown(RequestStatusEnum)),
  //     },
  //     {
  //       label: 'Agent',
  //       name: 'broker_id',
  //       type: FilterTypeEnum.AGENT_SELECTOR,
  //     },
  //     {
  //       label: 'Client',
  //       name: 'client_id',
  //       type: FilterTypeEnum.CLIENT_SELECTOR,
  //     },
  //     {
  //       label: 'Category',
  //       name: 'category',
  //       type: FilterTypeEnum.MULTISELECT,
  //       options: of(enumToDropDown(PolicyCategoryEnum)),
  //     },
  //     {
  //       label: 'Min coverage',
  //       name: 'min_coverage',
  //       type: FilterTypeEnum.CURRENCY,
  //     },
  //     {
  //       label: 'Max coverage',
  //       name: 'max_coverage',
  //       type: FilterTypeEnum.CURRENCY,
  //     },
  //   ];

  //   const filteredFilters = allFilters.filter(item => {
  //     if (isInsured) {
  //       return item.name !== 'broker_id' && item.name !== 'client_id';
  //     }
  //     return true;
  //   });

  //   return { filters: filteredFilters };
  // }

  getRequestsListFilters(role: string): FilterWrapperModel {
    const isInsured = role === RolesEnum.INSURED;
    const isAgencyBroker = role === RolesEnum.AGENCY_BROKER;

    const allFilters = [
      {
        label: 'Creation date',
        name: 'created_at_date',
        type: FilterTypeEnum.DATE_RANGE,
      },
      {
        label: 'Status',
        name: 'status',
        type: FilterTypeEnum.MULTISELECT,
        options: of(enumToDropDown(RequestStatusEnum)),
      },
      {
        label: 'Agent',
        name: 'broker_id',
        type: FilterTypeEnum.AGENT_SELECTOR,
      },
      {
        label: 'Client',
        name: 'client_id',
        type: FilterTypeEnum.CLIENT_SELECTOR,
      },
      {
        label: 'Category',
        name: 'category',
        type: FilterTypeEnum.MULTISELECT,
        options: of(enumToDropDown(PolicyCategoryEnum)),
      },
      {
        label: 'Min coverage',
        name: 'min_coverage',
        type: FilterTypeEnum.CURRENCY,
      },
      {
        label: 'Max coverage',
        name: 'max_coverage',
        type: FilterTypeEnum.CURRENCY,
      },
    ];

    const filteredFilters = allFilters.filter(item => {
      if (isInsured) {
        return item.name !== 'broker_id' && item.name !== 'client_id';
      }

      if (isAgencyBroker) {
        return item.name !== 'broker_id';
      }

      return true;
    });

    return { filters: filteredFilters };
  }

  /**
   * deprecated de aca en adelante, hay que ir revisando donde se utlizan y eliminando sus referencias
   */

  getQuoteRequests(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<HttpFormatResponse<QuoteRequestResponseModel[]>> {
    pageIndex++;
    return this._http.get<HttpFormatResponse<QuoteRequestResponseModel[]>>(
      `${
        environment.apiUrl
      }requests/finder?include_deletions=false&page_number=${pageIndex}&docs_per_page=${pageSize}${
        filters ?? ''
      }`
    );
  }

  getClientQuoteRequest(
    accountId: string,
    includeDeletions: boolean = false
  ): Observable<HttpFormatResponse<QuoteRequestModel[]>> {
    const url = `${environment.apiUrl}requests/finder?account=${accountId}&include_deletions=${includeDeletions}`;

    return this._http
      .get<HttpFormatResponse<QuoteRequestModel[]>>(url)
      .pipe(tap(response => {}));
  }

  getRequestByBroker(
    brokerId: string,
    includeDeletions: boolean = false
  ): Observable<HttpFormatResponse<QuoteRequestModel[]>> {
    const url = `${environment.apiUrl}requests/finder?include_deletions=${includeDeletions}&broker_id=${brokerId}&page_number=1&docs_per_page=10`;

    return this._http
      .get<HttpFormatResponse<QuoteRequestModel[]>>(url)
      .pipe(tap(response => {}));
  }

  archiveRequest(quoteRequestId: string) {
    const url = `${environment.apiUrl}requests/${quoteRequestId}`;
    return this._http.delete<HttpFormatResponse<any>>(url);
  }

  quoteRequestsFilteredByText(
    filteredBy: string,
    searchQuery: string
  ): Observable<HttpFormatResponse<QuoteRequestResponseModel[]>> {
    return this._http.get<HttpFormatResponse<QuoteRequestResponseModel[]>>(
      `${environment.apiUrl}requests/finder?${filteredBy}=${searchQuery}&include_deletions=true&page_number=1&docs_per_page=10`
    );
  }

  getQuoteRequestById(
    id: string
  ): Observable<HttpResponseModel<QuoteRequestModel>> {
    return this._http.get<HttpResponseModel<QuoteRequestModel>>(
      `${environment.apiUrl}requests/${id}`
    );
  }

  getRequestById(id: string): Observable<RequestDetailsModel> {
    return this._http
      .get<HttpResponseModel<RequestDetailsBackendEntity>>(
        `${environment.apiUrl}requests/${id}`
      )
      .pipe(map(request => RequestDetailsDTO.mapTo(request.data)));
  }

  createRequestLegacy(req: any): Observable<any> {
    return this._http.post(environment.apiUrl + 'requests', req);
  }
}
