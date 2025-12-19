import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  sendInvitation(email: string): Promise<any> {
    const invitationData = { email };

    return new Promise((resolve, reject) => {
      this.http
        .post<any>(`${environment.apiUrl}auth/send-invitation`, invitationData)
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
    });
  }
}
