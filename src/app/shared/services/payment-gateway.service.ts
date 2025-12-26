import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreatePaymentSessionIdRequest } from '../interfaces/requests/payment-gateway/create-payment-session-id.request';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymetGatewayService {
  constructor(private _http: HttpClient) {}

  createPaymentSessionId(
    req: CreatePaymentSessionIdRequest
  ): Observable<string> {
    return this._http
      .post<ApiResponseModel<string>>(
        `${environment.apiUrl}payment-gateway`,
        req
      )
      .pipe(map(resp => resp.data));
  }
  getCustomerPortalUrl(): Observable<string> {
    return this._http
      .post<ApiResponseModel<string>>(
        `${environment.apiUrl}payment-gateway/portal`,
        {}
      )
      .pipe(map(resp => resp.data));
  }
}
