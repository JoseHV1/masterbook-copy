import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { map, Observable, of } from 'rxjs';
import { HttpResponseModel } from '../models/response/http.response.model';
import { environment } from 'src/environments/environment';
import { FilterWrapperModel } from '../models/filters.model';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { FormModel, PopulatedFormModel } from '../interfaces/models/form.model';
import { DatasetsService } from './dataset.service';
import { PolicyCategoryEnum } from '../enums/policy-category.enum';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { CreateFormRequest } from '../interfaces/requests/forms/create-form.request';
import { UpdateFormRequest } from '../interfaces/requests/forms/update-form.request';
import { NewFormRequest } from '../interfaces/requests/forms/new-form.request';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private _http: HttpClient, private _dataset: DatasetsService) {}

  /**
   * @deprecated
   */
  createForm(req: CreateFormRequest): Observable<FormModel> {
    return this._http
      .post<ApiResponseModel<FormModel>>(environment.apiUrl + 'form', req)
      .pipe(map(resp => resp.data));
  }

  newForm(req: NewFormRequest): Observable<FormModel> {
    return this._http
      .post<ApiResponseModel<FormModel>>(environment.apiUrl + 'form', req)
      .pipe(map(resp => resp.data));
  }

  buildFormFilterText(policy_type_id: string): string {
    return `&policy_type_id=${policy_type_id}`;
  }

  getForms(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedFormModel[]>> {
    pageIndex++;
    return this._http
      .get<HttpResponseModel<PaginatedResponse<PopulatedFormModel[]>>>(
        environment.apiUrl +
          `form?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(
        map(response => {
          return response.data;
        })
      );
  }

  getForm(id: string): Observable<FormModel> {
    return this._http
      .get<ApiResponseModel<FormModel>>(`${environment.apiUrl}form/${id}`)
      .pipe(map(response => response.data));
  }

  updateForm(id: string, req: UpdateFormRequest): Observable<FormModel> {
    return this._http
      .put<ApiResponseModel<FormModel>>(environment.apiUrl + 'form/' + id, req)
      .pipe(map(resp => resp.data));
  }

  deleteForm(id: string): Observable<void> {
    return this._http.delete(`${environment.apiUrl}form/${id}`).pipe(
      map(() => {
        return;
      })
    );
  }

  getFormsListFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Name',
          name: 'name',
          type: FilterTypeEnum.TEXT,
        },
        {
          label: 'Category',
          name: 'category',
          type: FilterTypeEnum.SELECT,
          options: of(enumToDropDown(PolicyCategoryEnum)),
        },
        {
          label: 'Business line',
          name: 'business_line_id',
          type: FilterTypeEnum.SELECT,
          options: this._dataset.getBusinessLinesDataset().pipe(
            map(lines =>
              lines.map(item => ({
                code: item._id,
                name: item.name,
              }))
            )
          ),
        },
      ],
    };
  }
}
