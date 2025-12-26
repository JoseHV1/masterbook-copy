import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponseModel } from '../interfaces/models/api-response.model';

type GoogleStatus = { google: { connected: boolean; providerUid?: string } };

@Injectable({ providedIn: 'root' })
export class IntegrationsService {
  constructor(private _api: ApiService) {}

  getIntegrationsStatus(): Observable<GoogleStatus['google']> {
    return this._api
      .get<ApiResponseModel<GoogleStatus>>('/integrations/google/status')
      .pipe(
        // tap(resp => console.log('Raw API response (status):', resp)),
        map(r => r.data.google)
      );
  }

  getGoogleAuthUrl(returnTo?: string): Observable<{ url: string }> {
    return this._api
      .post<ApiResponseModel<{ url: string }>>(
        '/integrations/google/auth-url',
        returnTo ? { returnTo } : {}
      )
      .pipe(
        // tap(resp => console.log('Raw API response (auth-url):', resp)),
        map(r => r.data)
      );
  }
}
