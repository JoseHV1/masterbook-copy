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

    const backendMsg =
      err.error?.message ||
      err.error?.response?.message ||
      (typeof err.error === 'string' ? err.error : undefined);

    if (
      backendMsg &&
      typeof backendMsg === 'string' &&
      backendMsg.toLowerCase() !== 'bad request'
    ) {
      return backendMsg;
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
      if (translated !== `BACKEND_MESSAGES_ERRORS.${backendCode}`) {
        return translated;
      }
    }

    if (Array.isArray(err.error?.message)) {
      return err.error.message.join(', ');
    }

    if (
      err.error?.error &&
      typeof err.error.error === 'string' &&
      err.error.error !== 'Bad Request'
    ) {
      return err.error.error;
    }

    if (err.statusText && err.statusText !== 'Unknown Error')
      return err.statusText;

    return this._translate.instant('BACKEND_MESSAGES_ERRORS.UNKNOWN_ERROR');
  }
}
