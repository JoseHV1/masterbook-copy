import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

//mover interfaces
export interface PaginatedThreadResponse {
  threads: any[];
  nextPageToken: string | null;
}

export interface Attachment {
  filename: string;
  mimeType: string;
  content: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  attachments: Attachment[];
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private _http: HttpClient) {}

  getEmailInbox(
    pageIndex: string,
    inbo: number,
    category: string,
    query?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    return this._http
      .get<any>(environment.apiUrl + `email/inbox/${pageIndex}/${category}`, {
        params,
      })
      .pipe(map(resp => resp.data));
  }

  getEmailDetail(idMail: string): Observable<any> {
    return this._http
      .get<any>(environment.apiUrl + `email/message/${idMail}`)
      .pipe(map(resp => resp.data));
  }

  downloadAttachmentFile(
    messageId: string,
    attachmentId: string
  ): Observable<Blob> {
    return this._http.get(
      `${environment.apiUrl}email/download/${messageId}/${attachmentId}`,
      {
        responseType: 'blob',
      }
    );
  }

  printEmailAsPdf(threadId: string): Observable<Blob> {
    return this._http.get(`${environment.apiUrl}email/print/${threadId}`, {
      responseType: 'blob',
    });
  }

  sendEmail(payload: EmailPayload): Observable<any> {
    return this._http.post(`${environment.apiUrl}email/send`, payload);
  }

  sendReply(
    payload: any,
    threadId: string,
    originalMessageId: string
  ): Observable<any> {
    const replyEndpoint = `${environment.apiUrl}email/send-response/${threadId}/${originalMessageId}`;
    return this._http.post(replyEndpoint, payload);
  }

  sendForward(payload: any): Observable<any> {
    const forwardEndpoint = `${environment.apiUrl}email/send-forward`;
    return this._http.post(forwardEndpoint, payload);
  }

  deleteEmail(idMail: string): Observable<any> {
    return this._http.delete(`${environment.apiUrl}email/${idMail}`);
  }
}
