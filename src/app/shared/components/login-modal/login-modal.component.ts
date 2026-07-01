import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../services/auth.modal.service';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, finalize, map, switchMap, takeUntil } from 'rxjs';
import { LoginRequest } from '../../interfaces/requests/auth/login.request';
import { PopulatedUserModel } from '../../interfaces/models/user.model';
import { RolesEnum } from '../../enums/roles.enum';
import { ERRORS_LIBRARY } from '../../enums/error-library';
import { environment } from 'src/environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';
import { TenantsService } from '../../services/tenants.service';
import { LanguageService } from '../../services/language.service';
import { AvailableLanguagesEnum } from '../../enums/available-languages.enum';
import { TenantContextService } from '../../services/tenant-context.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnDestroy {
  @ViewChild('captchaElem') captchaElem!: RecaptchaComponent;

  private destroy$ = new Subject<void>();
  showPassword = false;
  formLogin!: FormGroup;
  emailNotVerified: boolean = false;
  email_to_resend?: string;
  currencyRoute: string = 'agents';

  recaptchaSiteKey = environment.RECAPTCHA_SITE_KEY;
  isLocal = environment.text === 'local';

  constructor(
    private formBuilder: FormBuilder,
    private _authModal: AuthModalService,
    private _ui: UiService,
    private _auth: AuthService,
    private router: Router,
    private _tenants: TenantsService,
    private _language: LanguageService,
    private _tenantCtx: TenantContextService,
    private _t: TranslateService,
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
      recaptcha: ['', this.recaptchaSiteKey ? [Validators.required] : []],
    });

    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
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

  onResolved(token: string | null) {
    this.formLogin.get('recaptcha')?.setValue(token, { emitEvent: false });
  }

  login() {
    if (this.formLogin.invalid) {
      return;
    }

    const req = this.formLogin.getRawValue() as LoginRequest;

    this._ui.showLoader();
    this._auth
      .login(req)
      .pipe(
        switchMap(user =>
          this._tenants.getForCurrentAgency().pipe(
            map(tenant => ({ user, tenant }))
          )
        ),
        finalize(() => this._ui.hideLoader()),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: ({ user, tenant }) => {
          this._tenantCtx.setTenant(tenant);
          if (tenant?.document_language) {
            this._language.changeLanguage(tenant.document_language as unknown as AvailableLanguagesEnum);
          }

          const fullname = `${user.first_name ?? ''} ${user.last_name ?? ''}`;
          this._ui.showAlertSuccess(this._t.instant('SHARED.AUTH.WELCOME', { name: fullname }));

          this.formLogin.reset(undefined, { emitEvent: false });
          this.safeCaptchaReset();

          this.handleNavigation(user.role);
        },
        error: (err: { error: { code: ERRORS_LIBRARY } }) => {
          this.safeCaptchaReset();

          if (err.error?.code === ERRORS_LIBRARY.EMAIL_IS_NOT_VERIFIED) {
            this.emailNotVerified = true;
            this.email_to_resend = this.formLogin.value.email ?? '';
            return;
          }
        },
      });
  }

  private safeCaptchaReset() {
    this.formLogin.get('recaptcha')?.setValue('', { emitEvent: false });
    if (this.captchaElem) {
      try {
        this.captchaElem.reset();
      } catch (e) {
        console.warn('Recaptcha reset ignored: component not ready');
      }
    }
  }

  private handleNavigation(role?: RolesEnum) {
    switch (role) {
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
  }

  resendToken() {
    this._ui.showLoader();
    this._auth
      .resendActivationEmail({ email: this.email_to_resend ?? '' })
      .pipe(
        finalize(() => this._ui.hideLoader()),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: () => this._ui.showAlertSuccess(this._t.instant('SHARED.AUTH.ACTIVATION_EMAIL_SENT')),
        error: () => {},
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
