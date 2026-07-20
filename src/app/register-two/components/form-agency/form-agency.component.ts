import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isInvalid } from '../../../shared/helpers/is-invalid.helper';
import { hasError } from 'src/app/shared/helpers/has-error.helper';
import { WelcomeService } from 'src/app/shared/services/welcome.service';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { finalize, of, switchMap, tap } from 'rxjs';
import { CompleteRegisterRolesEnum } from 'src/app/shared/enums/roles.enum';
import { CompleteRegisterRequest } from 'src/app/shared/interfaces/requests/broker/complete-register.request';
import { Router } from '@angular/router';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { PaymetGatewayService } from 'src/app/shared/services/payment-gateway.service';
import { PAYABLE_ITEMS } from 'src/app/shared/enums/payable-items.enum';
import { ModalTermsPoliciesComponent } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-form-agency',
  templateUrl: './form-agency.component.html',
  styleUrls: ['./form-agency.component.scss'],
})
export class FormAgencyComponent implements OnInit {
  form!: FormGroup;
  today: Date = new Date();
  maxLicenseExpirationDate: Date = new Date(
    this.today.getFullYear() + 20,
    this.today.getMonth(),
    this.today.getDate()
  );
  isInvalid = isInvalid;
  hasError = hasError;
  businessLines: BusinessLineModel[] = [];
  staffSize: { name: string; code: string }[] = [
    { name: '0-9', code: '0-9' },
    { name: '10-100', code: '10-100' },
    { name: '101-1000', code: '101-1000' },
  ];

  constructor(
    private _welcome: WelcomeService,
    private _datasets: DatasetsService,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _router: Router,
    private _paymentGateway: PaymetGatewayService,
    private dialog: MatDialog,
  ) {
    this._ui.showLoader();
    this.form = this._welcome.createAgencyForm();
    this._datasets.getBusinessLinesListDataset()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(businessLines => {
        this.businessLines = businessLines;
      });
  }

  ngOnInit(): void {
    if (this._auth.getAuth()?.user?.created_by_admin) {
      this._ui.showLoader();
      this._auth.getOnboardingData()
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe((data: any) => {
          this.form.patchValue({
            name: data.agency_name ?? null,
            phone_number: data.phone_number ?? null,
            license_number: data.license_number ?? null,
            license_number_expires_on: data.license_expires_at ? new Date(data.license_expires_at) : null,
            business_lines_ids: data.business_lines ?? [],
            staff_size: data.staff_size ?? null,
            address: data.address_info?.address ?? null,
            additional_address: data.address_info?.additional_address ?? null,
          });
          if (data.address_info?.address) {
            this.form.controls['address_extra'].setValue({
              address: data.address_info.address,
              country: data.address_info.country,
              latitude: data.address_info.latitude,
              longitude: data.address_info.longitude,
              zipcode: data.address_info.zipcode ?? null,
            });
          }
          this._cd.detectChanges();
        });
    }
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
      role: CompleteRegisterRolesEnum.AGENCY_OWNER,
      photo_base64: this.form.value.profile_image ?? undefined,
      logo_base64: this.form.value.logo ?? undefined,
      check_branding: !!(
        (this.form.value.check_brand_publication as Array<string>) ?? []
      ).length,
      name: this.form.value.name,
      position: this.form.value.position,
      license_number: this.form.value.license_number ?? '',
      license_expires_at: (
        this.form.value.license_number_expires_on as Date
      ).toISOString(),
      phone_number: this.form.value.phone_number,
      staff_size: 1,
      address_info: {
        address: this.form.value.address_extra?.address ?? '',
        additional_address: this.form.value.additional_address ?? '',
        country: this.form.value.address_extra?.country ?? '',
        latitude: this.form.value.address_extra?.latitude ?? 0,
        longitude: this.form.value.address_extra?.longitude ?? 0,
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
        switchMap(resp => {
          if (resp.billing_mode === 'FREE') {
            return of(null);
          }
          return this._paymentGateway
            .createPaymentSessionId({ pay_item: PAYABLE_ITEMS.AGENCY_MEMBERSHIP })
            .pipe(tap(url => (window.location.href = url)));
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._router.navigateByUrl('/portal');
      });
  }
}
