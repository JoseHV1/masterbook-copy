import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiService } from '../services/ui.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorsHttpInterceptor implements HttpInterceptor {
  constructor(private _ui: UiService, private _translate: TranslateService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: unknown) => {
        if (!(err instanceof HttpErrorResponse)) {
          const message = this._translate.instant(
            'BACKEND_MESSAGES_ERRORS.UNKNOWN_ERROR'
          );
          this._ui.showAlertError(message);
          return throwError(() => err);
        }

        const message = this.extractMessage(err);
        this._ui.showAlertError(message);

        return throwError(() => err);
      })
    );
  }

  private extractMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return this._translate.instant('BACKEND_MESSAGES_ERRORS.NETWORK_ERROR');
    }

    if (err.error instanceof Blob) {
      return (
        err.statusText ||
        this._translate.instant('BACKEND_MESSAGES_ERRORS.UNKNOWN_ERROR')
      );
    }

    const backendCode =
      err.error?.code ||
      err.error?.error?.code ||
      err.error?.response?.code ||
      undefined;

    if (backendCode && typeof backendCode === 'string') {
      const translated = this._translate.instant(
        `BACKEND_MESSAGES_ERRORS.${backendCode}`
      );
      return translated !== `BACKEND_MESSAGES_ERRORS.${backendCode}`
        ? translated
        : backendCode;
    }

    const backendMsg =
      err.error?.message?.message ||
      (Array.isArray(err.error?.message)
        ? err.error.message.join(', ')
        : err.error?.message) ||
      err.error?.error ||
      undefined;

    if (backendMsg && typeof backendMsg === 'string') {
      return backendMsg;
    }

    if (err.message) return err.message;
    if (err.statusText) return err.statusText;

    return this._translate.instant('BACKEND_MESSAGES_ERRORS.UNKNOWN_ERROR');
  }
}
