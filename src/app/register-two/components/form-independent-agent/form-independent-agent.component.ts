import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isInvalid } from 'src/app/shared/helpers/is-invalid.helper';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { WelcomeService } from 'src/app/shared/services/welcome.service';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { finalize, switchMap, tap } from 'rxjs';
import { CompleteRegisterRequest } from 'src/app/shared/interfaces/requests/broker/complete-register.request';
import { CompleteRegisterRolesEnum } from 'src/app/shared/enums/roles.enum';
import { Router } from '@angular/router';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { PaymetGatewayService } from 'src/app/shared/services/payment-gateway.service';
import { PAYABLE_ITEMS } from 'src/app/shared/enums/payable-items.enum';
import { ModalTermsPoliciesComponent } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-independent-agent',
  templateUrl: './form-independent-agent.component.html',
  styleUrls: ['./form-independent-agent.component.scss'],
})
export class FormIndependentAgentComponent {
  form!: FormGroup;
  today: Date = new Date();
  isInvalid = isInvalid;
  hasError = hasError;
  businessLines: BusinessLineModel[] = [];

  constructor(
    private _welcome: WelcomeService,
    private _datasets: DatasetsService,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _router: Router,
    private _paymentGateway: PaymetGatewayService,
    private dialog: MatDialog
  ) {
    this._ui.showLoader();
    this.form = this._welcome.createNewIndependentAgentForm();
    this._datasets
      .getBusinessLinesDataset()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(businessLines => (this.businessLines = businessLines));
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

    const req: CompleteRegisterRequest = {
      role: CompleteRegisterRolesEnum.INDEPENDANT_BROKER,
      photo_base64: this.form.value.profile_image ?? undefined,
      logo_base64: this.form.value.logo ?? undefined,
      check_branding: !!(
        (this.form.value.check_brand_publication as Array<string>) ?? []
      ).length,
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
      business_lines: (this.form.value.business_lines_ids ?? []).map(
        (line: { _id: string }) => line._id ?? ''
      ),
      accepted_terms_conditions: this.form.value.accepted_terms_conditions,
    };

    this._ui.showLoader();
    this._auth
      .completeRegister(req)
      .pipe(
        switchMap(() =>
          this._paymentGateway
            .createPaymentSessionId({
              pay_item: PAYABLE_ITEMS.INDEPENDENT_AGENT,
            })
            .pipe(tap(resp => (window.location.href = resp)))
        ),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._router.navigateByUrl('/portal');
      });
  }
}
