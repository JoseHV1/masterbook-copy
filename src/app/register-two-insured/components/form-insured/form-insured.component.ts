import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isInvalid } from 'src/app/shared/helpers/is-invalid.helper';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { WelcomeService } from 'src/app/shared/services/welcome.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalTermsPoliciesComponent } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.component';
import { CompleteRegisterInsuredRequest } from 'src/app/shared/interfaces/requests/accounts/complete-register-insured.request';
import { reduceRestLetter } from 'src/app/shared/helpers/reduce-rest-letter';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-insured',
  templateUrl: './form-insured.component.html',
  styleUrls: ['./form-insured.component.scss'],
})
export class FormInsuredComponent {
  auth: AuthModel;
  form!: FormGroup;
  today: Date = new Date();

  isInvalid = isInvalid;
  hasError = hasError;
  reduceRestLetter = reduceRestLetter;

  dropDownMaritalStatus: DropdownOptionModel[] =
    enumToDropDown(MaritalStatusEnum);
  dropDownGender: DropdownOptionModel[] = enumToDropDown(GenderEnum);

  constructor(
    private _welcome: WelcomeService,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _auth: AuthService,
    private dialog: MatDialog
  ) {
    this.form = this._welcome.createNewInsuredForm();
    this.auth = this._auth.getAuth() as AuthModel;
    this.fillData(this.auth.user);
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

  fillData(data: any) {
    this.form.patchValue({
      first_name: data.first_name,
      last_name: data.last_name,
      accepted_terms_conditions: data.accepted_terms_conditions_at,
      phone_number: data.phone_number,
      phone_extension: data.phone_extension,
      marital_status: {
        name: reduceRestLetter(data.marital_status),
        code: data.marital_status,
      },
      gender: {
        name: reduceRestLetter(data.gender),
        code: data.gender,
      },
      address_extra: {
        address: data.address_info.address ?? '',
        country: data.address_info.country ?? '',
        latitude: data.address_info.latitude ?? '',
        longitude: data.address_info.longitude ?? '',
        zipcode: data.address_info.zipcode ?? '',
        additional_address: data.address_info.additional_address ?? '',
      },
      zipcode: data.address_info.zipcode,
      address: data.address_info.address ?? '',
      additional_address: data.address_info.additional_address ?? '',
      profile_image: data.profile_image ?? undefined,
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

    const req: CompleteRegisterInsuredRequest = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      accepted_terms_conditions: this.form.value.accepted_terms_conditions,
      phone_number: this.form.value.phone_number,
      phone_extension: this.form.value.phone_extension,
      marital_status: this.form.value.marital_status.code,
      gender: this.form.value.gender.code,
      address_info: {
        additional_address: this.form.value.additional_address ?? '',
        address: this.form.value.address_extra?.address ?? '',
        country: this.form.value.address_extra.country ?? '',
        latitude: this.form.value.address_extra?.latitude ?? '',
        longitude: this.form.value.address_extra?.longitude ?? '',
        zipcode: this.form.value.zipcode ?? '',
      },
      photo_base64: this.form.value.profile_image ?? undefined,
      account_name: this.auth.user.account?.account_name,
      ssn: this.auth.user.account?.ssn,
      status: this.auth.user.account?.status,
      date_of_birth: this.auth.user.date_of_birth
        ? new Date(this.auth.user.date_of_birth).toISOString()
        : undefined,
    };

    this._ui.showLoader();
    this._auth
      .completeRegisterInsured(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._router.navigateByUrl('/portal-client');
      });
  }
}
