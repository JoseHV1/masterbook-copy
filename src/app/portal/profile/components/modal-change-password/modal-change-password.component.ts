import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { PopulatedUserModel } from 'src/app/shared/interfaces/models/user.model';
import { ChangePasswordRequest } from 'src/app/shared/interfaces/requests/profile/change-password.request';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],
})
export class ModalChangePasswordComponent implements OnInit {
  form!: FormGroup;
  dataUser!: PopulatedUserModel;
  showCurrent = false;
  showNew = false;
  showRepeat = false;

  constructor(
    private _profile: ProfileService,
    private _ui: UiService,
    private _auth: AuthService,
    private dialogRef: MatDialogRef<ModalChangePasswordComponent>
  ) {
    this.form = this._profile.createChangePasswordForm();
  }

  ngOnInit(): void {
    this.dataUser = this._auth.getAuth()?.user as PopulatedUserModel;
  }

  get passwordRules() {
    const control = this.form.get('new_password');
    const repeatControl = this.form.get('repeat_new_password');
    const errors = control?.errors || {};

    const passwordsHaveLength =
      control?.value?.length > 0 && repeatControl?.value?.length > 0;

    const rules = [
      { label: 'Minimum 8 characters', valid: !errors['MIN_LENGTH'] },
      { label: 'Includes an uppercase letter', valid: !errors['UPPERCASE'] },
      { label: 'Includes a number', valid: !errors['NUMBER'] },
      { label: 'Includes a special character', valid: !errors['SPECIAL_CHAR'] },
      {
        label: 'Passwords must match',
        valid: passwordsHaveLength && control?.value === repeatControl?.value,
      },
    ];

    return rules;
  }

  send() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const req: ChangePasswordRequest = {
      current_password: this.form.value.current_password,
      new_password: this.form.value.new_password,
      repeat_new_password: this.form.value.repeat_new_password,
    };

    this._ui.showLoader();

    this._profile
      .changePassword(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.form.reset();
        this._ui.showAlertSuccess('Password updated successfully');
        this.dialogRef.close();
      });
  }
}
