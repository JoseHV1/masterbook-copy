import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { CreateHowToRequest } from '../interfaces/requests/how-to/create-request.request';
import { HowToModel } from '../interfaces/models/how-to.model';
import {
  MoveHowToOrder,
  UpdateHowToRequest,
} from '../interfaces/requests/how-to/update-how-to.request';

@Injectable({
  providedIn: 'root',
})
export class HowToService {
  constructor(private _http: HttpClient) {}

  createHowTo(req: CreateHowToRequest): Observable<HowToModel> {
    return this._http
      .post<ApiResponseModel<HowToModel>>(environment.apiUrl + 'how-to', req)
      .pipe(map(resp => resp.data));
  }

  editHowTo(req: UpdateHowToRequest, id: string): Observable<HowToModel> {
    return this._http
      .put<ApiResponseModel<HowToModel>>(
        `${environment.apiUrl}how-to/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  moveHowToItem(id: string, req: MoveHowToOrder): Observable<HowToModel> {
    return this._http
      .put<ApiResponseModel<HowToModel>>(
        `${environment.apiUrl}how-to/move/${id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  getHowTo(_id: string): Observable<HowToModel> {
    return this._http
      .get<ApiResponseModel<HowToModel>>(`${environment.apiUrl}how-to/${_id}`)
      .pipe(map(response => response.data));
  }

  getHowToBySerial(serial: string): Observable<HowToModel> {
    return this._http
      .get<ApiResponseModel<HowToModel>>(
        `${environment.apiUrl}how-to/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  deleteHowTo(_id: string): Observable<Record<string, string>> {
    return this._http
      .delete<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}how-to/${_id}`
      )
      .pipe(map(resp => resp.data));
  }

  getHowToList(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<HowToModel[]>> {
    pageIndex++;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<HowToModel[]>>>(
        environment.apiUrl +
          `how-to?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getHowToFilters(): FilterWrapperModel {
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
