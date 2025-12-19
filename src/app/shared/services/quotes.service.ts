import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpFormatResponse } from '../models/response/http-format.response';
import { QuotesModel } from '../models/DTO/quotes/quotes.model';
import { QuotesDTO } from '../models/DTO/quotes/quotes.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponseModel } from '../models/response/http.response.model';
import { QuotesBackendEntity } from '../models/DTO/quotes/quotes.back-entity';
import { QuotesRequest } from '../models/requests/quotes.request';
import { CreateQuoteRequest } from '../interfaces/requests/quotes/create-quote.request';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { PopulatedQuoteModel } from '../interfaces/models/quote.model';
import { UpdateQuoteStatusRequest } from '../interfaces/requests/quotes/update-quote-status.request';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  constructor(private _http: HttpClient) {}

  createQuote(req: CreateQuoteRequest): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}quote`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  getQuotesByRequest(request_id: string): Observable<PopulatedQuoteModel[]> {
    return this._http
      .get<ApiResponseModel<PopulatedQuoteModel[]>>(
        `${environment.apiUrl}quote/request/${request_id}`
      )
      .pipe(map(resp => resp.data));
  }

  setQuoteStatus(
    req: UpdateQuoteStatusRequest
  ): Observable<Record<string, string>> {
    return this._http
      .patch<ApiResponseModel<Record<string, string>>>(
        `${environment.apiUrl}quote/status`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  getQuote(id: string): Observable<PopulatedQuoteModel> {
    return this._http
      .get<ApiResponseModel<PopulatedQuoteModel>>(
        `${environment.apiUrl}quote/${id}`
      )
      .pipe(map(resp => resp.data));
  }

  /**
   * de aqui hacia abajo estan deprecados los metodos
   */

  createQuotes(req: QuotesRequest): Observable<any> {
    return this._http.post(environment.apiUrl + 'quotes', req);
  }

  getQuoteForm(): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: '001', disabled: true }, [
        Validators.required,
      ]),
      coverageAmount: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      deductible: new FormControl(null, [Validators.required]),
      insuranceType: new FormControl(null, [Validators.required]),
      pdf: new FormControl(null),
      policyPrime: new FormControl(null, [Validators.required]),
      requestId: new FormControl(null),
      status: new FormControl(null),
    });
  }

  getQuotes(
    pageNumber: number = 1,
    size: number = 50
  ): Observable<HttpFormatResponse<QuotesModel[]>> {
    return this._http.get<HttpFormatResponse<QuotesModel[]>>(
      `${environment.apiUrl}quotes?page=${pageNumber}&size=${size}`
    );
  }

  getQuotesPolicy(id: string): Observable<QuotesModel[]> {
    return this._http
      .get<HttpResponseModel<QuotesBackendEntity[]>>(
        `${environment.apiUrl}quotes/quote/${id}`
      )
      .pipe(
        map(response => response.data.map(quote => QuotesDTO.mapTo(quote)))
      );
  }

  getQuoteById(id: string): Observable<QuotesModel> {
    return this._http
      .get<HttpResponseModel<QuotesBackendEntity>>(
        `${environment.apiUrl}quotes/${id}`
      )
      .pipe(map(request => QuotesDTO.mapTo(request.data)));
  }

  updateStatusQuote(
    id: string,
    status: string
  ): Observable<HttpResponseModel<{ status: string; _id: string }>> {
    return this._http.put<HttpResponseModel<{ status: string; _id: string }>>(
      `${environment.apiUrl}quotes/quote/${id}/status?status=${status}`,
      {}
    );
  }
}
