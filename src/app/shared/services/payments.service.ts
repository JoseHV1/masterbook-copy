import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseModel } from '../models/response/http.response.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterWrapperModel } from '../models/filters.model';
import { FilterTypeEnum } from '../enums/filter-type.enum';
import { enumToDropDown } from '../helpers/enum-to-dropdown.helper';
import { PaymentTransactionStatusEnum } from '../enums/payment-transaction-status.enum';
import { PaginatedResponse } from '../interfaces/models/paginated-response.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import {
  PaymentTransactionModel,
  PopulatedPaymentTransactionModel,
} from '../models/payment-transaction.model';
import { CreatePaymentsTransactionsRequest } from '../interfaces/requests/payments-transactions/create-payments-transactions.request';
import { DatasetsService } from './dataset.service';
import { PaymentEntityEnum } from '../enums/payment-entity.enum';

export type PaymentsQuery = {
  status?: string;
  policy_id?: string;
  client_id?: string;
  broker_id?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
};

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  maxDate: Date = new Date();
  today: Date = new Date();

  balance: number = 0;

  constructor(private _http: HttpClient, private _dataset: DatasetsService) {
    this.maxDate.setFullYear(this.today.getFullYear() - 18);
  }

  getPaymentsForm(): FormGroup {
    const paymentForm = new FormGroup({
      payment_from: new FormControl(null, [Validators.required]),
      payment_date: new FormControl(null, [Validators.required]),
      total_amount: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      insurer_company: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      account: new FormControl(null, [Validators.required]),
      retentions: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      taxes: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      check_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      paymentApplications: new FormArray([]),
      subtotal: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });

    return paymentForm;
  }

  createPaymentApplication(openBalance: number): FormGroup {
    return new FormGroup({
      policy_number: new FormControl(null, [Validators.required]),
      invoice_number: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      payment_applied: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      open_balance: new FormControl({ value: openBalance, disabled: true }),
    });
  }

  postPaymentTransaction(
    req: CreatePaymentsTransactionsRequest
  ): Observable<PaymentTransactionModel> {
    return this._http
      .post<ApiResponseModel<PaymentTransactionModel>>(
        `${environment.apiUrl}payment-transactions`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  getPaymentTransactions(
    pageIndex: number,
    pageSize: number,
    filters?: string
  ): Observable<PaginatedResponse<PopulatedPaymentTransactionModel[]>> {
    pageIndex++;
    return this._http
      .get<
        ApiResponseModel<PaginatedResponse<PopulatedPaymentTransactionModel[]>>
      >(
        environment.apiUrl +
          `payment-transactions?page=${pageIndex}&limit=${pageSize}${
            filters ?? ''
          }`
      )
      .pipe(map(resp => resp.data));
  }

  getPaymentsListFilters(): FilterWrapperModel {
    return {
      filters: [
        {
          label: 'Payment date',
          name: 'created_at_date',
          type: FilterTypeEnum.DATE_RANGE,
        },
        {
          label: 'Status',
          name: 'status',
          type: FilterTypeEnum.MULTISELECT,
          options: of(enumToDropDown(PaymentTransactionStatusEnum)),
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

  getPaymentApplicationsForm(): FormArray {
    return new FormArray<FormGroup>([]);
  }

  updateRowOpenBalance(paymentApplication: FormGroup): void {
    const paymentApplied =
      paymentApplication.get('payment_applied')?.value || 0;
    const previousBalance = paymentApplication.get('open_balance')?.value || 0;
    const newOpenBalance = previousBalance - paymentApplied;

    paymentApplication
      .get('open_balance')
      ?.setValue(newOpenBalance, { emitEvent: false });
  }

  getPaymentTransaction(
    id: string
  ): Observable<PopulatedPaymentTransactionModel> {
    return this._http
      .get<HttpResponseModel<PopulatedPaymentTransactionModel>>(
        `${environment.apiUrl}payment-transactions/${id}`
      )
      .pipe(map(resp => resp.data));
  }

  getPaymentTransactionBySerial(
    id: string
  ): Observable<PopulatedPaymentTransactionModel> {
    return this._http
      .get<HttpResponseModel<PopulatedPaymentTransactionModel>>(
        `${environment.apiUrl}payment-transactions/serial/${id}`
      )
      .pipe(map(resp => resp.data));
  }

  getAllPayments(id: string): Observable<PopulatedPaymentTransactionModel[]> {
    return this._http
      .get<HttpResponseModel<PopulatedPaymentTransactionModel[]>>(
        `${environment.apiUrl}payments/transactions/${id}`
      )
      .pipe(map(response => response.data));
  }
}
