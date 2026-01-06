import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map, BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../interfaces/models/auth.model';
import { PopulatedUserModel } from '../interfaces/models/user.model';
import { ApiResponseModel } from '../interfaces/models/api-response.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from './local-storage.service';
import { EditProfileRequest } from '../interfaces/requests/profile/edit-profile.request';
import { PasswordStrengthValidator } from '../validators/password-strength.validator';
import { matchPasswords } from '../validators/match-password.validator';
import { ChangePasswordRequest } from '../interfaces/requests/profile/change-password.request';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private authSubject: BehaviorSubject<AuthModel | null>;
  public readonly auth$: Observable<AuthModel | null>;
  currentDate: Date;
  effectiveDate: Date;

  constructor(
    private _http: HttpClient,
    private _storage: LocalStorageService
  ) {
    this.currentDate = new Date();
    this.effectiveDate = new Date(this.currentDate);
    this.effectiveDate.setFullYear(this.effectiveDate.getFullYear() + 1);

    const rawAuth = this._storage.getItem('MASTERBOOK_AUTH');
    this.authSubject = new BehaviorSubject<AuthModel | null>(
      rawAuth ? (rawAuth as AuthModel) : null
    );
    this.auth$ = this.authSubject.asObservable();
  }

  getAuth(): AuthModel | null {
    return this.authSubject.getValue();
  }

  createEditProfileForm(): FormGroup {
    return new FormGroup({
      profile_image: new FormControl(null),
      phone_extension: new FormControl(null),
      gender: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      additional_address: new FormControl(null, [Validators.maxLength(100)]),
      address_extra: new FormControl(null, []),
      zipcode: new FormControl(null, [Validators.required]),
      license_number: new FormControl(null, [Validators.required]),
      license_expires_at: new FormControl(null, [Validators.required]),
      allow_email_notifications: new FormControl(false, [Validators.required]),
      allow_expiring_policies_notifications: new FormControl(false, [
        Validators.required,
      ]),
      days_expiring_policies_notifications: new FormControl(null, []),
      allow_show_whatsapp_number: new FormControl(false, [Validators.required]),
    });
  }

  editProfile(data: EditProfileRequest): Observable<PopulatedUserModel> {
    return this._http
      .patch<ApiResponseModel<PopulatedUserModel>>(
        `${environment.apiUrl}auth/profile`,
        data
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

  createChangePasswordForm(): FormGroup {
    return new FormGroup(
      {
        current_password: new FormControl(null, [Validators.required]),
        new_password: new FormControl(null, [
          Validators.required,
          PasswordStrengthValidator.strongPassword(),
        ]),
        repeat_new_password: new FormControl(null, [Validators.required]),
      },
      { validators: matchPasswords('new_password', 'repeat_new_password') }
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<PopulatedUserModel> {
    return this._http
      .patch<ApiResponseModel<PopulatedUserModel>>(
        `${environment.apiUrl}auth/change-password`,
        data
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

  getUserData(id: string): Observable<PopulatedUserModel> {
    return this._http
      .get<ApiResponseModel<{ user: PopulatedUserModel }>>(
        `${environment.apiUrl}auth/profile`
      )
      .pipe(map(resp => ({ ...resp.data.user })));
  }

  disconnectGoogle(): Observable<{ ok: boolean; disconnected: boolean }> {
    return this._http
      .delete<ApiResponseModel<{ ok: boolean; disconnected: boolean }>>(
        `${environment.apiUrl}integrations/google/disconnect`
      )
      .pipe(map(resp => resp.data));
  }

  getGoogleStatus(): Observable<{
    google: { connected: boolean; providerUid?: string; email?: string };
  }> {
    return this._http
      .get<
        ApiResponseModel<{
          google: { connected: boolean; providerUid?: string; email?: string };
        }>
      >(`${environment.apiUrl}integrations/google/status`)
      .pipe(map(resp => resp.data));
  }
}
