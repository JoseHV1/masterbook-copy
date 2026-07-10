import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, forkJoin, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PopulatedFormModel } from 'src/app/shared/interfaces/models/form.model';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';
import { fileUploadMode } from 'src/core/cdk/file-upload/file-upload.component';

@Component({
  selector: 'app-admin-form-form',
  templateUrl: './form-form.component.html',
  styleUrls: ['./form-form.component.scss'],
})
export class AdminFormFormComponent implements OnInit, OnDestroy {
  @Input() form: PopulatedFormModel | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formGroup!: FormGroup;
  fileUploadMode = fileUploadMode;
  insurers: DropdownOption[] = [];
  tenants: DropdownOption[] = [];
  policyTypes: DropdownOption[] = [];

  private _lastInsurerList: InsurerModel[] = [];
  private _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _ui: UiService,
    private _insurers: InsurerConfigService,
    private _tenants: TenantsService,
    private _dataset: DatasetsService,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    this._loadOptions();

    this.formGroup
      .get('tenant_ids')
      ?.valueChanges.pipe(
        switchMap(tenantIds => this._applyTenantFilter(tenantIds)),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.formGroup = this._fb.group({
      name: [null, [Validators.required]],
      tenant_ids: [[], [Validators.required]],
      insurer_ids: [{ value: null, disabled: true }, [Validators.required]],
      policy_type_id: [null, [Validators.required]],
      form_document: [null, [Validators.required]],
    });
  }

  private _loadOptions(): void {
    this._ui.showLoader();
    forkJoin([
      this._tenants.getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`).pipe(map(r => r.records)),
      this._dataset.getAllPolicyTypes(),
    ])
      .pipe(takeUntil(this._destroy$), finalize(() => this._ui.hideLoader()))
      .subscribe(([tenantList, policyTypeList]) => {
        this.tenants = [
          { code: '', name: this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ALL_TENANTS') },
          ...tenantList.map(t => ({ code: t._id, name: `${t.name} (${t.code})` })),
        ];
        this.policyTypes = policyTypeList.map((pt: PopulatedPolicyTypeModel) => ({
          code: pt._id,
          name: pt.name,
        }));

        if (this.form) this._patchForm(this.form);
        this._applyTenantFilter(this.formGroup.value.tenant_ids).subscribe();
      });
  }

  private _applyTenantFilter(tenantIds: string[]): Observable<unknown> {
    const isAll = Array.isArray(tenantIds) && tenantIds[0] === '';
    const selected = (tenantIds || []).filter(id => !!id);
    const insurerControl = this.formGroup.get('insurer_ids');

    if (!isAll && selected.length === 0) {
      this.insurers = [];
      insurerControl?.setValue(null, { emitEvent: false });
      insurerControl?.disable({ emitEvent: false });
      return of(null);
    }

    insurerControl?.enable({ emitEvent: false });

    const filters = isAll ? '' : `&tenant_ids=${selected.join(',')}`;
    return this._insurers.getInsurers(0, 1000, filters).pipe(
      map(r => r.records),
      map(insurerList => {
        this._lastInsurerList = insurerList;
        this.insurers = [
          { code: '', name: this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ALL_INSURERS') },
          ...insurerList.map(i => ({ code: i._id, name: i.name })),
        ];

        const currentInsurerIds = insurerControl?.value;
        if (Array.isArray(currentInsurerIds)) {
          const validCodes = new Set(this.insurers.map(o => o.code));
          const stillValid = currentInsurerIds.filter((id: string) => validCodes.has(id));
          if (stillValid.length !== currentInsurerIds.length) {
            insurerControl?.setValue(stillValid, { emitEvent: false });
          }
        }
      }),
    );
  }

  private _patchForm(form: PopulatedFormModel): void {
    this.formGroup.patchValue({
      name: form.name,
      tenant_ids: form.tenant_ids?.length ? form.tenant_ids : [''],
      insurer_ids: form.insurer_ids,
      policy_type_id: form.policy_type_id,
      form_document: form.form_document,
    });
    // In edit mode the document already exists — re-upload is optional
    this.formGroup.get('form_document')?.clearValidators();
    this.formGroup.get('form_document')?.updateValueAndValidity();
  }

  submit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const raw = this.formGroup.getRawValue();
    const rawInsurerIds: string[] = raw.insurer_ids;
    const rawTenantIds: string[] = raw.tenant_ids;

    const isAllTenants = Array.isArray(rawTenantIds) && rawTenantIds[0] === '';
    const selectedTenantIds = isAllTenants ? [] : rawTenantIds;

    const finalInsurerIds: string[] =
      Array.isArray(rawInsurerIds) && rawInsurerIds[0] === ''
        ? this.insurers.slice(1).map(i => i.code)
        : rawInsurerIds;

    const payload = {
      ...raw,
      tenant_ids: isAllTenants
        ? []
        : this._resolveCoveredTenants(selectedTenantIds, finalInsurerIds),
      insurer_ids: finalInsurerIds,
    };

    this.formSubmit.emit(payload);
  }

  /**
   * Drops tenants from the selection that aren't actually covered by any of the
   * chosen insurers — a tenant kept in `tenant_ids` with no matching insurer
   * would make the form unusable for that tenant.
   */
  private _resolveCoveredTenants(selectedTenantIds: string[], insurerIds: string[]): string[] {
    if (!selectedTenantIds.length) return selectedTenantIds;

    const covered = new Set<string>();
    for (const insurerId of insurerIds) {
      const insurer = this._lastInsurerList.find(i => i._id === insurerId);
      if (!insurer) continue;

      if (!insurer.tenant_ids?.length) {
        selectedTenantIds.forEach(t => covered.add(t));
      } else {
        insurer.tenant_ids
          .filter(t => selectedTenantIds.includes(t))
          .forEach(t => covered.add(t));
      }
    }

    return selectedTenantIds.filter(t => covered.has(t));
  }

  isInvalid(field: string): boolean {
    const c = this.formGroup.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
