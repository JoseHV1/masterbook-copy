import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditAgencySettingsRequest } from '../interfaces/requests/agencies/edit-agency-settings.request';
import { AgencyModel } from '../interfaces/models/agency.model';

@Injectable({
  providedIn: 'root',
})
export class AgencySettingsService {
  constructor(private _http: HttpClient) {}

  getAgencySettings(): Observable<AgencyModel> {
    return this._http
      .get<ApiResponseModel<AgencyModel>>(
        `${environment.apiUrl}auth/agency-settings`
      )
      .pipe(map(resp => resp.data));
  }

  createEditSettingsForm(): FormGroup {
    return new FormGroup({
      retentions: new FormControl(null, [
        Validators.min(1),
        Validators.max(100),
      ]),
      taxes: new FormControl(null, [Validators.min(1), Validators.max(100)]),
    });
  }

  editAgencySetting(data: EditAgencySettingsRequest): Observable<AgencyModel> {
    return this._http
      .patch<ApiResponseModel<AgencyModel>>(
        `${environment.apiUrl}auth/agency-settings`,
        data
      )
      .pipe(map(resp => resp.data));
  }
}
