import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../services/auth.modal.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';
import { ResetPasswordRequest } from '../../interfaces/requests/auth/reset-password.request';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
})
export class ForgotPasswordModalComponent {
  formForgotPassword!: FormGroup;
  formResetPassword!: FormGroup;
  step: number = 1;
  code!: number;
  minutes: number = 4;
  seconds: number = 59;
  clockPaused: boolean = false;
  isDisableButton: boolean = true;
  showPassword = false;
  showConfirmPassword = false;
  @Output() closeModalForgot: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private _authModal: AuthModalService,
    private _ui: UiService,
    private _auth: AuthService
  ) {
    this.formForgotPassword = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
    });

    this.formResetPassword = this.formBuilder.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  invalidEmail() {
    return this.formForgotPassword.get('email')?.hasError('pattern');
  }

  invalidMinLength(field: string) {
    return this.formResetPassword.get(field)?.hasError('minlength');
  }

  forgotPassword() {
    if (this.formForgotPassword.invalid) {
      return;
    }

    this._ui.showLoader();
    this._auth
      .forgotPassword(this.formForgotPassword.value)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.step = 2;
        this._ui.showAlertSuccess('An email has been sent to you');
        this.activeClock();
      });
  }

  changeStep() {
    this.step = 3;
    this.clockPaused = true;
  }

  resetPassword() {
    if (this.formResetPassword.invalid) {
      return;
    }

    const value = this.formResetPassword.value;
    delete value.password_confirmation;
    const req = {
      ...value,
      ...this.formForgotPassword.value,
      code: `${value.code}`,
    } as ResetPasswordRequest;

    this._ui.showLoader();
    this._auth
      .resetPassword(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.formResetPassword.reset();
        this._ui.showAlertSuccess('Password successfully changed');
        this.closeModalForgot.emit(false);
      });
  }

  activeClock() {
    setInterval(() => {
      if (!this.clockPaused) {
        if (--this.seconds < 0) {
          this.seconds = 59;

          if (--this.minutes < 0) {
            this.minutes = 4;
            this.seconds = 59;
          }
        }

        if (this.seconds === 0 && this.minutes === 0) {
          this.clockPaused = true;
          this.step = 1;
          this._ui.showAlertError(
            'The code has expired, please request it again'
          );
        }
      }
    }, 1000);
  }

  showLogin() {
    this._authModal.openLogin();
  }
}
