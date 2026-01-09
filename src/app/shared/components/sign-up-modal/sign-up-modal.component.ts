import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthModalService } from '../../services/auth.modal.service';
import { AuthService } from '../../services/auth.service';
import { UiService } from '../../services/ui.service';
import { MyMasterbookValidators } from '../../helpers/mymasterbook-validator';
import { Subject, finalize, takeUntil } from 'rxjs';
import { RegisterRequest } from '../../interfaces/requests/auth/register.request';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss'],
})
export class SingupModalComponent implements OnDestroy {
  form!: FormGroup;
  destroy$: Subject<void> = new Subject();
  showNew = false;
  showRepeat = false;
  recaptchaSiteKey = environment.RECAPTCHA_SITE_KEY;
  isLocal = environment.text === 'local';

  constructor(
    private formBuilder: FormBuilder,
    private _authModal: AuthModalService,
    private _auth: AuthService,
    private _ui: UiService
  ) {
    this.form = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(MyMasterbookValidators.emailPattern),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          MyMasterbookValidators.uppercase(),
          MyMasterbookValidators.number(),
          MyMasterbookValidators.specialChar(),
        ],
      ],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      recaptcha: ['', this.isLocal ? [] : [Validators.required]],
    });

    this.form
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((resp: string) => {
        const passwordConfirmControl = this.form.get('passwordConfirm');

        passwordConfirmControl?.setValidators([
          Validators.required,
          Validators.minLength(8),
          MyMasterbookValidators.equals(resp),
        ]);

        passwordConfirmControl?.updateValueAndValidity();
      });
  }

  onResolved(token: string | null) {
    this.form.get('recaptcha')?.setValue(token);
  }

  isEqualsPasswords() {
    return this.form.get('passwordConfirm')?.hasError('equals');
  }

  fieldInvalid(field: string) {
    return this.form.get(field)?.invalid && this.form.get(field)?.touched;
  }

  invalidEmail() {
    return this.form.get('email')?.hasError('pattern');
  }

  invalidMinLength(field: string) {
    return this.form.get(field)?.hasError('minlength');
  }

  singUp() {
    if (this.form.invalid) {
      return;
    }

    const req = { ...this.form.value };
    delete req.passwordConfirm;

    this._ui.showLoader();
    this._auth
      .register(req as RegisterRequest)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this.form.reset();
          this._authModal.openNotification();
        },
        error: () => {
          this.form.get('recaptcha')?.setValue('');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
