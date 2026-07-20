import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { AdminPanelService } from 'src/app/shared/services/admin-panel.service';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';

@Component({
  selector: 'app-create-agency',
  templateUrl: './create-agency.component.html',
  styleUrls: ['./create-agency.component.scss'],
})
export class CreateAgencyComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  clientType: 'agency' | 'independent_broker' = 'agency';
  tenantOptions: { name: string; code: string }[] = [];
  businessLineOptions: { name: string; code: string }[] = [];
  genderOptions = [
    { name: 'Masculino', code: 'MALE' },
    { name: 'Femenino', code: 'FEMALE' },
    { name: 'Otro', code: 'OTHER' },
  ];
  billingModeOptions = [
    { name: 'STRIPE (Pago vía Stripe)', code: 'STRIPE' },
    { name: 'FREE (Sin cobro)', code: 'FREE' },
  ];
  staffSizeOptions = [
    { name: '0-9', code: '0-9' },
    { name: '10-100', code: '10-100' },
    { name: '101-1000', code: '101-1000' },
  ];

  maxDob: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  minLicenseDate: Date = new Date();

  private _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _ui: UiService,
    private _adminPanel: AdminPanelService,
    private _tenants: TenantsService,
    private _dataset: DatasetsService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    this._loadOptions();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      first_name:        [null, [Validators.required, Validators.minLength(2)]],
      last_name:         [null, [Validators.required, Validators.minLength(2)]],
      email:             [null, [Validators.required, Validators.email]],
      gender:            [null, [Validators.required]],
      date_of_birth:     [null, [Validators.required]],
      agency_name:       [null, [Validators.required, Validators.minLength(2)]],
      phone_number:      [null, [Validators.required]],
      tenant_id:         [null, [Validators.required]],
      billing_mode:      ['STRIPE', [Validators.required]],
      license_number:    [null, [Validators.required, Validators.minLength(2)]],
      license_expires_at:[null, [Validators.required]],
      business_lines:    [[], [Validators.required]],
      staff_size:        [null],
      address:           [null],
      additional_address:[null],
      country:           [null],
      latitude:          [null],
      longitude:         [null],
      zipcode:           [null],
    });
  }

  private _loadOptions(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: resp => {
          this.tenantOptions = (resp.records ?? []).map((t: any) => ({
            name: `${t.name} (${t.code})`,
            code: t._id,
          }));
        },
      });

    this._dataset
      .getBusinessLinesDataset()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (lines: BusinessLineModel[]) => {
          this.businessLineOptions = lines.map(l => ({
            name: l.name,
            code: l._id,
          }));
        },
      });
  }

  selectClientType(type: 'agency' | 'independent_broker'): void {
    this.clientType = type;
    if (type === 'agency') {
      this.form.get('agency_name')?.setValidators([Validators.required, Validators.minLength(2)]);
    } else {
      this.form.get('agency_name')?.clearValidators();
      this.form.get('agency_name')?.setValue(null);
    }
    this.form.get('agency_name')?.updateValueAndValidity();
  }

  onAddressChange(data: AddressAutocompleteModel): void {
    this.form.patchValue({
      address: data.address,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      zipcode: data.zipcode ?? null,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this._ui.showLoader();

    const payload = this.form.value;
    const call$ = this.clientType === 'agency'
      ? this._adminPanel.createAgency(payload)
      : this._adminPanel.createIndependentBroker(payload);

    call$
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => this._router.navigateByUrl('portal-admin/agencies'),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/agencies');
  }
}
