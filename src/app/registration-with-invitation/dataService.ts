import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  sendUserData(userData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(`${environment.apiUrl}auth/invitation-signup`, userData)
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
