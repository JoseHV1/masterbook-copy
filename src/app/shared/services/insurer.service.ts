import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { InsuranceCompanyModel } from '../models/DTO/insurance-company/insurance-company.model';
import { InsuranceCompanyBackendEntity } from '../models/DTO/insurance-company/insurance-company.back-entity';
import { InsuranceCompanyDTO } from '../models/DTO/insurance-company/insurance-companyDTO';
import { CommissionConfigModel } from '../interfaces/models/commission-config.model';

@Injectable({
  providedIn: 'root',
})
export class InsurerService {
  constructor(private _http: HttpClient) {}

  getInsurers(): Observable<InsuranceCompanyModel[]> {
    return this._http
      .get<HttpResponseModel<InsuranceCompanyBackendEntity[]>>(
        environment.apiUrl +
          'insurance_company/finder?page_number=1&docs_per_page=10'
      )
      .pipe(
        map(response =>
          response.data.map(insurance => InsuranceCompanyDTO.mapTo(insurance))
        )
      );
  }

  getInsurerById(id: string): Observable<InsuranceCompanyModel> {
    return this._http
      .get<HttpResponseModel<InsuranceCompanyBackendEntity>>(
        environment.apiUrl +
          // '/insurance_company/{id}?insurance_company_id=670583edab60101038f5f38f'
          `insurance_company/${id}`
      )
      .pipe(map(request => InsuranceCompanyDTO.mapTo(request.data)));
  }

  changeStatusInsurer(
    id: string,
    status: string
  ): Observable<HttpResponseModel<{ _id: string; status: string }>> {
    return this._http.put<HttpResponseModel<{ _id: string; status: string }>>(
      environment.apiUrl +
        `insurance_company/insurance_company/${id}/status?status=${status}`,
      {}
    );
  }

  getInsurerCommissionConfig(
    insurerId: string,
    policyTypeId: string
  ): Observable<CommissionConfigModel[]> {
    return this._http
      .get<HttpResponseModel<CommissionConfigModel[]>>(
        `${environment.apiUrl}commission-config/insurer-config/${insurerId}/${policyTypeId}`
      )
      .pipe(map(request => request.data));
  }
}
