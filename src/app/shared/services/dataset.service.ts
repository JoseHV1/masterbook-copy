import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import {
  BusinessLineModel,
  EstructuredBusinessLineModel,
} from '../interfaces/models/business-line.model';
import { InsuranceCompanyModel } from '../interfaces/models/insurance-company.model';
import { PopulatedPolicyTypeModel } from '../interfaces/models/policy-type.model';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { mapEstructuredPolicyCategories } from '../helpers/estructured-policy-types.mapper';
import { EstructuredPolicyCategoryModel } from '../interfaces/models/policy-category.model';
import { mapEstructuredBusinessLines } from '../helpers/estructured-business-lines.mapper';
import { ProductTypeEnum } from '../enums/product-type.enum';
import { PopulatedBrokerModel } from '../interfaces/models/broker.model';
import { PopulatedAccount } from '../interfaces/models/accounts.model';

@Injectable({
  providedIn: 'root',
})
export class DatasetsService {
  constructor(private _http: HttpClient) {}

  getBusinessLinesDataset(): Observable<BusinessLineModel[]> {
    return this._http
      .get<ApiResponseModel<BusinessLineModel[]>>(
        `${environment.apiUrl}business-lines`
      )
      .pipe(map(resp => resp.data));
  }

  getPolicyCategoriesDataset(
    businessLineId: string
  ): Observable<BusinessLineModel[]> {
    return this._http
      .get<ApiResponseModel<BusinessLineModel[]>>(
        `${environment.apiUrl}business-lines/policy-categories/${businessLineId}`
      )
      .pipe(map(resp => resp.data));
  }

  getPolicyTypesDataset(
    businessLineId: string,
    policyCategoryId: string
  ): Observable<BusinessLineModel[]> {
    return this._http
      .get<ApiResponseModel<BusinessLineModel[]>>(
        `${environment.apiUrl}business-lines/policy-types/${businessLineId}/${policyCategoryId}`
      )
      .pipe(map(resp => resp.data));
  }

  getInsuranceCompaniesDataset(): Observable<InsuranceCompanyModel[]> {
    return this._http
      .get<ApiResponseModel<InsuranceCompanyModel[]>>(
        `${environment.apiUrl}insurer`
      )
      .pipe(
        map(resp => resp.data),
        map(data => data.filter(item => item.status !== 'inactive'))
      );
  }

  getEstructuredPolcyTpesDataset(
    type?: ProductTypeEnum
  ): Observable<EstructuredPolicyCategoryModel[]> {
    const filter = type ? `&type=${type}` : ``;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedPolicyTypeModel[]>>>(
        `${environment.apiUrl}policy-type/list?page=1&limit=10000${filter}`
      )
      .pipe(
        map(resp => resp.data.records),
        map(resp => mapEstructuredPolicyCategories(resp))
      );
  }

  getEstructuredBusinessLinesDataset(
    type?: ProductTypeEnum
  ): Observable<EstructuredBusinessLineModel[]> {
    const filter = type ? `&type=${type}` : ``;

    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedPolicyTypeModel[]>>>(
        `${environment.apiUrl}policy-type/list?page=1&limit=10000${filter}`
      )
      .pipe(
        map(resp => resp.data.records),
        map(resp => mapEstructuredBusinessLines(resp))
      );
  }

  getAllPolicyTypes(
    type?: ProductTypeEnum
  ): Observable<PopulatedPolicyTypeModel[]> {
    const filter = type ? `&type=${type}` : ``;

    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedPolicyTypeModel[]>>>(
        `${environment.apiUrl}policy-type/list?page=1&limit=10000${filter}`
      )
      .pipe(map(resp => resp.data.records));
  }

  getPolcyTpesDataset(): Observable<PopulatedPolicyTypeModel[]> {
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedPolicyTypeModel[]>>>(
        `${environment.apiUrl}policy-type/list?page=1&limit=10000`
      )
      .pipe(map(resp => resp.data.records));
  }

  getBrokersDataset(): Observable<PopulatedBrokerModel[]> {
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedBrokerModel[]>>>(
        `${environment.apiUrl}broker?page=1&limit=10000`
      )
      .pipe(map(resp => resp.data.records));
  }

  getAccountDataset(): Observable<PopulatedAccount[]> {
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedAccount[]>>>(
        `${environment.apiUrl}account?page=1&limit=10000`
      )
      .pipe(map(resp => resp.data.records));
  }
}
