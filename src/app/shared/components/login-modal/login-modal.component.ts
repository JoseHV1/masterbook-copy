import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../services/auth.modal.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, finalize, pipe, takeUntil } from 'rxjs';
import { LoginRequest } from '../../interfaces/requests/auth/login.request';
import { PopulatedUserModel } from '../../interfaces/models/user.model';
import { RolesEnum } from '../../enums/roles.enum';
import { ERRORS_LIBRARY } from '../../enums/error-library';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  showPassword = false;
  formLogin!: FormGroup;
  emailNotVerified: boolean = false;
  email_to_resend?: string;
  currencyRoute: string = 'agents';

  constructor(
    private formBuilder: FormBuilder,
    private _authModal: AuthModalService,
    private _ui: UiService,
    private _auth: AuthService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        const url = event['urlAfterRedirects'].split('?')[0] ?? '';
        if (url.includes('clients')) this.currencyRoute = 'clients';
        if (url.includes('agents')) this.currencyRoute = 'agents';
      });
  }

  get invalidEmail() {
    return this.formLogin.get('email')?.hasError('pattern');
  }

  get invalidMinLength() {
    return this.formLogin.get('password')?.hasError('minlength');
  }

  login() {
    if (this.formLogin.invalid) {
      return;
    }

    const req = this.formLogin.value as LoginRequest;

    this._ui.showLoader();
    this._auth
      .login(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: (resp: Partial<PopulatedUserModel>) => {
          const fullname = `${resp.first_name ?? ''} ${resp.last_name ?? ''}`;
          this._ui.showAlertSuccess(`welcome ${fullname}`);
          this.formLogin.reset();

          switch (resp.role) {
            case RolesEnum.INSURED:
              this.router.navigate(['/portal-client']);
              break;

            case RolesEnum.ADMIN:
              this.router.navigate(['/portal-admin']);
              break;

            default:
              this.router.navigate(['/portal']);
              break;
          }
        },
        error: err => {
          if (err.error.code === ERRORS_LIBRARY.EMAIL_IS_NOT_VERIFIED) {
            this.emailNotVerified = true;
            this.email_to_resend = this.formLogin.value.email ?? '';
            return;
          }
        },
      });
  }

  resendToken() {
    this._ui.showLoader();
    this._auth
      .resendActivationEmail({ email: this.email_to_resend ?? '' })
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          'A new activation email has been sent to your inbox.'
        );
      });
  }

  showModalSignup() {
    this._authModal.openSignUp();
  }

  showModalForgot() {
    this._authModal.openForgotPassword();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
