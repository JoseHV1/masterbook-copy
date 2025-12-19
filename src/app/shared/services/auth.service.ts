import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { RegisterRequest } from '../interfaces/requests/auth/register.request';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { ActivateUserRequest } from '../interfaces/requests/auth/activate-user.request';
import { LoginRequest } from '../interfaces/requests/auth/login.request';
import { PopulatedUserModel } from '../interfaces/models/user.model';
import { AuthModel } from '../interfaces/models/auth.model';
import { RolesEnum } from '../enums/roles.enum';
import { ResendActivationEmailRequest } from '../interfaces/requests/auth/resend-activation-email.request';
import { ForgotPasswordRequest } from '../interfaces/requests/auth/forgot-password.request';
import { ResetPasswordRequest } from '../interfaces/requests/auth/reset-password.request';
import { CompleteRegisterRequest } from '../interfaces/requests/broker/complete-register.request';
import { CompleteRegisterInsuredRequest } from '../interfaces/requests/accounts/complete-register-insured.request';
import { CompleteRegisterAgencyBrokerAdminRequest } from '../interfaces/requests/agencies/complete-register-agency-broker-admin.request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject: BehaviorSubject<AuthModel | null>;
  public readonly auth$: Observable<AuthModel | null>;

  constructor(
    private _http: HttpClient,
    private _storage: LocalStorageService
  ) {
    const rawAuth = this._storage.getItem('MASTERBOOK_AUTH');
    this.authSubject = new BehaviorSubject<AuthModel | null>(
      rawAuth ? (rawAuth as AuthModel) : null
    );
    this.auth$ = this.authSubject.asObservable();
  }

  register(req: RegisterRequest): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        environment.apiUrl + 'auth/register',
        req
      )
      .pipe(map(resp => resp.data));
  }

  activateUser(req: ActivateUserRequest): Observable<Record<string, string>> {
    return this._http
      .patch<ApiResponseModel<Record<string, string>>>(
        environment.apiUrl + `auth/activate-user`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  login(req: LoginRequest): Observable<Partial<PopulatedUserModel>> {
    return this._http
      .post<ApiResponseModel<AuthModel>>(environment.apiUrl + 'auth/login', req)
      .pipe(
        map(resp => {
          if (resp.data.user.email_verified_at) {
            this._storage.setItem('MASTERBOOK_AUTH', resp.data);
            this.authSubject.next(resp.data);
          }
          return resp.data.user;
        })
      );
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this._storage.deleteItem('MASTERBOOK_AUTH');
        this.authSubject.next(null);
      })
    );
  }

  resendActivationEmail(
    req: ResendActivationEmailRequest
  ): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        environment.apiUrl + 'auth/resend-activation-email',
        req
      )
      .pipe(map(resp => resp.data));
  }

  forgotPassword(
    req: ForgotPasswordRequest
  ): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        environment.apiUrl + `auth/forgot-password`,
        req
      )
      .pipe(map(resp => resp.data));
  }

  resetPassword(req: ResetPasswordRequest): Observable<Record<string, string>> {
    return this._http
      .post<ApiResponseModel<Record<string, string>>>(
        environment.apiUrl + 'auth/reset-password',
        req
      )
      .pipe(map(resp => resp.data));
  }

  completeRegister(
    req: CompleteRegisterRequest
  ): Observable<PopulatedUserModel> {
    return this._http
      .post<ApiResponseModel<PopulatedUserModel>>(
        `${environment.apiUrl}broker/complete-register`,
        req
      )
      .pipe(
        map(resp => resp.data),
        tap(resp => {
          const auth = this.getAuth();
          if (auth) {
            auth.user = resp;
            this._storage.setItem('MASTERBOOK_AUTH', auth);
            this.authSubject.next(auth);
          }
        })
      );
  }

  completeRegisterInsured(
    req: CompleteRegisterInsuredRequest
  ): Observable<PopulatedUserModel> {
    return this._http
      .post<ApiResponseModel<PopulatedUserModel>>(
        `${environment.apiUrl}account/complete-register`,
        req
      )
      .pipe(
        map(resp => resp.data),
        tap(resp => {
          const auth = this.getAuth();
          if (auth) {
            auth.user = resp;
            this._storage.setItem('MASTERBOOK_AUTH', auth);
            this.authSubject.next(auth);
          }
        })
      );
  }

  completeRegisterAgencyBrokerAdmin(
    req: CompleteRegisterAgencyBrokerAdminRequest
  ): Observable<PopulatedUserModel> {
    return this._http
      .post<ApiResponseModel<PopulatedUserModel>>(
        `${environment.apiUrl}broker/complete-register-agency-broker-admin`,
        req
      )
      .pipe(
        map(resp => resp.data),
        tap(resp => {
          const auth = this.getAuth();
          if (auth) {
            auth.user = resp;
            this._storage.setItem('MASTERBOOK_AUTH', auth);
            this.authSubject.next(auth);
          }
        })
      );
  }

  getAuth(): AuthModel | null {
    return this.authSubject.getValue();
  }

  refreshAuth(): Observable<Partial<PopulatedUserModel>> {
    return this._http
      .get<ApiResponseModel<{ user: Partial<PopulatedUserModel> }>>(
        environment.apiUrl + 'auth/profile'
      )
      .pipe(
        map(resp => {
          const auth: AuthModel = JSON.parse(JSON.stringify(this.getAuth()));
          auth.user = resp.data.user;
          this._storage.setItem('MASTERBOOK_AUTH', auth);
          this.authSubject.next(auth);
          return resp.data.user;
        })
      );
  }

  getLoggedInUserData() {
    const auth = this.getAuth();
    let loggedInUserId: string = '';
    let userIsAgent = false;
    let agencyId: any;

    if (auth) {
      loggedInUserId = auth?.user._id ?? '';
      userIsAgent =
        auth.user.role === RolesEnum.AGENCY_BROKER ||
        auth.user.role === RolesEnum.INDEPENDANT_BROKER;
      agencyId = auth.user.agency_id ?? '';
    }

    return { loggedInUserId, userIsAgent, agencyId };
  }
}
