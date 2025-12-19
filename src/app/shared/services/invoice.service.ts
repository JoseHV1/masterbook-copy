import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { HttpFormatResponse } from '../models/response/http-format.response';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { InvoiceStatusEnum } from '../enums/invoice-status.enum';
import { PaymentModel } from '../models/payments.model';
import { PopulatedInvoiceModel } from '../interfaces/models/invoice.model';
import { PopulatedCommisionModel } from '../interfaces/models/commisions.model';
import { PaymentEntityEnum } from '../enums/payment-entity.enum';
import { DatasetsService } from './dataset.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private _http: HttpClient, private _dataset: DatasetsService) {}

  getInvoices(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedInvoiceModel[]>> {
    pageIndex++;

    return this._http
      .get<ApiResponseModel<PaginatedResponse<PopulatedInvoiceModel[]>>>(
        environment.apiUrl +
          `invoices?page=${pageIndex}&limit=${pageSize}${filters ?? ''}`
      )
      .pipe(map(resp => resp.data));
  }

  getInvoicesListFilters(): FilterWrapperModel {
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
          options: of(enumToDropDown(InvoiceStatusEnum)),
        },
        {
          label: 'Agent',
          name: 'broker_id',
          type: FilterTypeEnum.AGENT_SELECTOR,
        },
        {
          label: 'Entity',
          name: 'payment_entity',
          type: FilterTypeEnum.PAYMENT_ENTITY,
          options: of([
            {
              code: '',
              name: 'All',
            },
            ...enumToDropDown(PaymentEntityEnum),
          ]),
        },
        {
          label: 'Account',
          name: 'account_id',
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
      ],
    };
  }

  getPaymentsByInvoiceId(invoiceId: string): Observable<PaymentModel[]> {
    return this._http
      .get<ApiResponseModel<PaymentModel[]>>(
        environment.apiUrl + `invoices/${invoiceId}/payments`
      )
      .pipe(
        map(resp => {
          return resp.data;
        })
      );
  }

  getCommissionsByInvoiceId(
    invoiceId: string
  ): Observable<PopulatedCommisionModel[]> {
    return this._http
      .get<ApiResponseModel<PopulatedCommisionModel[]>>(
        environment.apiUrl + `invoices/${invoiceId}/commissions`
      )
      .pipe(
        map(resp => {
          return resp.data;
        })
      );
  }

  getInvoiceById(invoiceId: string): Observable<PopulatedInvoiceModel> {
    return this._http
      .get<HttpResponseModel<PopulatedInvoiceModel>>(
        environment.apiUrl + `invoices/${invoiceId}`
      )
      .pipe(map(resp => resp.data));
  }

  getInvoiceBySerial(serial: string): Observable<PopulatedInvoiceModel> {
    return this._http
      .get<HttpResponseModel<PopulatedInvoiceModel>>(
        environment.apiUrl + `invoices/serial/${serial}`
      )
      .pipe(map(resp => resp.data));
  }

  getPaymentApplied(
    invoiceId: string
  ): Observable<HttpResponseModel<HttpFormatResponse<any>>> {
    return this._http.get<HttpResponseModel<HttpFormatResponse<any>>>(
      environment.apiUrl + `invoices/${invoiceId}/balance`
    );
  }

  searchInvoices(policyId: string, prefix: string): Observable<any[]> {
    return this._http
      .get<HttpResponseModel<any>>(
        `${environment.apiUrl}invoices/${policyId}/policies/${prefix}`
      )
      .pipe(map(response => response.data));
  }
}
