import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';
import { HttpResponseModel } from '../models/response/http.response.model';
import { environment } from 'src/environments/environment';
import { InsuranceCompanyModel } from '../models/DTO/insurance-company/insurance-company.model';
import { InsuranceCompanyBackendEntity } from '../models/DTO/insurance-company/insurance-company.back-entity';
import { InsuranceCompanyDTO } from '../models/DTO/insurance-company/insurance-companyDTO';
import { HttpFormatResponse } from '../models/response/http-format.response';
import { PolicyListModel } from '../models/DTO/policy-list/policy-list.model';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { CreatePolicyRequest } from '../interfaces/requests/policies/create-policy.request';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { DatasetsService } from './dataset.service';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { PolicyStatus } from '../enums/policy-status.enum';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { PopulatedPolicyModel } from '../interfaces/models/policy.model';
import { EditPolicyRequest } from '../interfaces/requests/policies/edit-policy.request';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfiguredInsurerAsyncValidator } from 'src/app/shared/helpers/configured-insurer.validator';
import { InsurerService } from './insurer.service';
import { PolicyCategoryEnum } from '../enums/policy-category.enum';
import { AuthService } from './auth.service';
import { RolesEnum } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  daysForPolicyExpiry: number | null = null;

  constructor(
    private _http: HttpClient,
    private _insurer: InsurerService,
    private _dataset: DatasetsService,
    private _auth: AuthService
  ) {}

  createUploadFileForm(): FormGroup {
    return new FormGroup({
      upload_file: new FormControl(null, [Validators.required]),
      insurers_mapping: new FormArray([]),
    });
  }

  createPolicyPreForm(): FormGroup {
    return new FormGroup({
      client_id: new FormControl(null, [Validators.required]),
      business_line_id: new FormControl(null, [Validators.required]),
      policy_category_id: new FormControl(null, [Validators.required]),
      policy_type_id: new FormControl(null, [Validators.required]),
    });
  }

  createPolicyForm(
    today: Date,
    policy_type_id: string,
    category: PolicyCategoryEnum
  ): FormGroup {
    const asyncValidators =
      policy_type_id && category
        ? [
            ConfiguredInsurerAsyncValidator(
              this._insurer,
              policy_type_id,
              this._getComissionCycleType(category)
            ),
          ]
        : [];

    return new FormGroup({
      policy_number: new FormControl(null, [Validators.required]),
      start_date: new FormControl(today, [Validators.required]),
      end_date: new FormControl(null, [Validators.required]),
      insurer_id: new FormControl(null, [Validators.required], asyncValidators),
      prime_amount: new FormControl(null, [Validators.required]),
      coverage: new FormControl(null, [Validators.required]),
      deductible: new FormControl(null, [Validators.required]),
      insure_object: new FormControl(null, [Validators.required]),
      document: new FormControl(null, []),
      request_documents: new FormControl(null, []),
      description: new FormControl(null, [Validators.required]),
      agent_id: new FormControl(null, [Validators.required]),
    });
  }

  private _getComissionCycleType(policyCategory: PolicyCategoryEnum) {
    if (
      [PolicyCategoryEnum.REINSTALLMENT, PolicyCategoryEnum.RENEWAL].includes(
        policyCategory
      )
    )
      return PolicyCategoryEnum.RENEWAL;
    return PolicyCategoryEnum.NEW_BUSINESS;
  }

  createPolicy(req: CreatePolicyRequest): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}policy`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  getPolicies(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedPolicyModel[]>> {
    pageIndex++;
    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedPolicyModel[]>>>(
        environment.apiUrl +
          `policy?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getPolicy(_id: string): Observable<PopulatedPolicyModel> {
    return this._http
      .get<ApiResponseModel<PopulatedPolicyModel>>(
        `${environment.apiUrl}policy/${_id}`
      )
      .pipe(map(response => response.data));
  }

  getPolicyBySerial(serial: string): Observable<PopulatedPolicyModel> {
    return this._http
      .get<ApiResponseModel<PopulatedPolicyModel>>(
        `${environment.apiUrl}policy/serial/${serial}`
      )
      .pipe(map(response => response.data));
  }

  editPolicy(
    _id: string,
    req: EditPolicyRequest
  ): Observable<Record<string, string>> {
    return this._http
      .put<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}policy/${_id}`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  deletePolicy(_id: string): Observable<Record<string, string>> {
    return this._http
      .delete<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}policy/${_id}`
      )
      .pipe(map(resp => resp.data));
  }

  cancelPolicy(_id: string): Observable<Record<string, string>> {
    return this._http
      .patch<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}policy/cancel/${_id}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }

  setPolicyAgent(
    _id: string,
    agent_id: string
  ): Observable<Record<string, string>> {
    return this._http
      .patch<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}policy/set-agent/${_id}`,
        { agent_id }
      )
      .pipe(map(resp => resp.data));
  }

  getPolicyListFilters(role: string): FilterWrapperModel {
    let filters = [
      {
        label: 'Creation date',
        name: 'created_at_date',
        type: FilterTypeEnum.DATE_RANGE,
      },
      {
        label: 'Effective date',
        name: 'effective_date',
        type: FilterTypeEnum.DATE_RANGE,
      },
      {
        label: 'Expiration date',
        name: 'expiration_date',
        type: FilterTypeEnum.DATE_RANGE,
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
        label: 'Insurer',
        name: 'insurer_id',
        type: FilterTypeEnum.MULTISELECT,
        options: this._dataset.getInsuranceCompaniesDataset().pipe(
          map(companies =>
            companies.map(item => ({
              code: item._id,
              name: item.name,
            }))
          )
        ),
      },
      {
        label: 'Status',
        name: 'status',
        type: FilterTypeEnum.MULTISELECT,
        options: of(enumToDropDown(PolicyStatus)),
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
      {
        label: 'Min Premium amount',
        name: 'min_prime_amount',
        type: FilterTypeEnum.CURRENCY,
      },
      {
        label: 'Max Premium amount',
        name: 'max_prime_amount',
        type: FilterTypeEnum.CURRENCY,
      },
      {
        label: 'Min deductible',
        name: 'min_deductible',
        type: FilterTypeEnum.CURRENCY,
      },
      {
        label: 'Max deductible',
        name: 'max_deductible',
        type: FilterTypeEnum.CURRENCY,
      },
    ];

    let policyOptions = [{ code: 'expired', name: 'Policies Expired' }];

    this._auth.refreshAuth().subscribe(authUser => {
      if (authUser.days_expiring_policies_notifications) {
        policyOptions.push({
          code: 'nearing_expired',
          name: 'Policies Nearing Expired',
        });
      }
    });

    filters.push({
      label: 'Policies',
      name: 'policies',
      type: FilterTypeEnum.MULTISELECT,
      options: of(policyOptions),
    });

    if (role === RolesEnum.INSURED) {
      filters = filters.filter(
        f => f.name !== 'broker_id' && f.name !== 'client_id'
      );
    } else if (role === RolesEnum.AGENCY_BROKER) {
      filters = filters.filter(f => f.name !== 'broker_id');
    }

    return { filters };
  }

  /**
   * @Deprecated
   *
   * de aqui en adelante se deben revisar las implementaciones y migrarlas a las nuevas
   */

  getInsuranceCompanyPicklist(
    pageNumber: number = 1,
    docsPerPage: number = 10
  ): Observable<InsuranceCompanyModel[]> {
    return this._http
      .get<HttpResponseModel<InsuranceCompanyBackendEntity[]>>(
        `${environment.apiUrl}insurance_company/finder?page_number=${pageNumber}&docs_per_page=${docsPerPage}`
      )
      .pipe(
        map(response =>
          response.data.map(insurance => InsuranceCompanyDTO.mapTo(insurance))
        )
      );
  }

  archivePolicy(policyId: string) {
    const url = `${environment.apiUrl}policy/${policyId}`;
    return this._http
      .delete<HttpFormatResponse<any>>(url)
      .pipe(tap(response => {}));
  }

  findPolicies(): Observable<HttpFormatResponse<PolicyListModel[]>> {
    return this._http
      .get<HttpResponseModel<HttpFormatResponse<PolicyListModel[]>>>(
        `${environment.apiUrl}policy/list`
      )
      .pipe(map(resp => resp.data));
  }

  findPoliciesByParams(query: {
    param: string;
    id: string;
  }): Observable<HttpFormatResponse<PolicyListModel[]>> {
    const params = new HttpParams({ fromObject: query });
    return this._http
      .get<HttpResponseModel<HttpFormatResponse<PolicyListModel[]>>>(
        `${environment.apiUrl}policy/list`,
        { params }
      )
      .pipe(map(resp => resp.data));
  }

  sendPolicyInvoicesByEmail(policy_id: string) {
    return this._http
      .post<ApiResponseModel<any>>(
        `${environment.apiUrl}policy/send-invoice/${policy_id}`,
        {}
      )
      .pipe(map(resp => resp.data));
  }
}
