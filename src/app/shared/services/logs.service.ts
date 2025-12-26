import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LogModel } from '../interfaces/models/log.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor(private _http: HttpClient) {}

  getLogsByEntityId(id: string): Observable<LogModel[]> {
    return this._http
      .get<ApiResponseModel<LogModel[]>>(
        `${environment.apiUrl}audit-logs/${id}`
      )
      .pipe(map(resp => resp.data));
  }
}
