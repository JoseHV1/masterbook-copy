import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketRequest } from '../interfaces/requests/ticket/ticket-request';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  webhook_url_jira: string =
    'https://n8n.mymasterbook.net/webhook/5b1c3b6d-0b62-4894-81de-d0cd590fa205';

  constructor(private _http: HttpClient) {}

  createTicketForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  }

  createTicket(req: TicketRequest): Observable<any> {
    return this._http
      .post<TicketRequest>(this.webhook_url_jira, req)
      .pipe(map(resp => resp));
  }
}
