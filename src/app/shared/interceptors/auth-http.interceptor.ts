import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthModel } from '../interfaces/models/auth.model';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this._auth.auth$.pipe(
      take(1),
      switchMap((auth: AuthModel | null) => {
        const token = auth?.token;
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this._auth.logout().subscribe(() => {
                this.router.navigate(['/']);
              });
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
