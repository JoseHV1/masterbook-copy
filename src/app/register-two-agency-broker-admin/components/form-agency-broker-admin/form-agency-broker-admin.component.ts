import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isInvalid } from 'src/app/shared/helpers/is-invalid.helper';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { WelcomeService } from 'src/app/shared/services/welcome.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ModalTermsPoliciesComponent } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { CompleteRegisterAgencyBrokerAdminRequest } from 'src/app/shared/interfaces/requests/agencies/complete-register-agency-broker-admin.request';

@Component({
  selector: 'app-form-agency-broker-admin',
  templateUrl: './form-agency-broker-admin.component.html',
  styleUrls: ['./form-agency-broker-admin.component.scss'],
})
export class FormAgencyBrokerAdminComponent {
  form!: FormGroup;
  today: Date = new Date();
  isInvalid = isInvalid;
  hasError = hasError;

  constructor(
    private _welcome: WelcomeService,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    this.form = this._welcome.createNewAgencyBrokerAdminForm();
    const auth = this._auth.getAuth() as AuthModel;
    this.fillData(auth.user);
  }

  fillData(data: any) {
    this.form.patchValue({
      phone_number: data.phone_number,
      license_number: data.broker.license_number,
      license_number_expires_on: new Date(data.broker.license_expires_at),
    });
  }

  openModal(show_container: string): void {
    this.dialog.open(ModalTermsPoliciesComponent, {
      height: '90%',
      width: '90%',
      maxWidth: '95%',
      panelClass: 'custom-dialog-container',
      data: {
        show_container,
      },
    });
  }

  handleAddress(address: AddressAutocompleteModel): void {
    this.form.controls['address_extra'].setValue(address);
    this._cd.detectChanges();
  }

  resetAddress(): void {
    this.form.controls['address_extra'].patchValue(null);
    this.form.controls['address_extra'].markAsDirty();
  }

  addImage(img: string, field: string): void {
    this.form.controls[field].patchValue(img);
  }

  send() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const req: CompleteRegisterAgencyBrokerAdminRequest = {
      photo_base64: this.form.value.profile_image ?? undefined,
      license_number: this.form.value.license_number ?? '',
      license_expires_at: (
        this.form.value.license_number_expires_on as Date
      ).toISOString(),
      phone_number: this.form.value.phone_number,
      address_info: {
        address: this.form.value.address_extra?.address ?? '',
        additional_address: this.form.value.additional_address ?? '',
        country: this.form.value.address_extra.country ?? '',
        latitude: this.form.value.address_extra?.latitude ?? '',
        longitude: this.form.value.address_extra?.longitude ?? '',
      },
      accepted_terms_conditions: this.form.value.accepted_terms_conditions,
    };

    this._ui.showLoader();
    this._auth
      .completeRegisterAgencyBrokerAdmin(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._router.navigateByUrl('/portal');
      });
  }
}
