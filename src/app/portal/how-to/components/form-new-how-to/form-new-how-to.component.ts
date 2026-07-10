import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { hasError } from '@app/shared/helpers/has-error.helper';
import { isInvalid } from '@app/shared/helpers/is-invalid.helper';
import { youtubeLinkValidator } from '@app/shared/helpers/mymasterbook-validator';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { CreateHowToRequest, TenantStatusItem } from '@app/shared/interfaces/requests/how-to/create-request.request';
import { UpdateHowToRequest } from '@app/shared/interfaces/requests/how-to/update-how-to.request';
import { HowToService } from '@app/shared/services/how-to.service';
import { TenantsService } from '@app/shared/services/tenants.service';
import { TenantStatusEnum } from '@app/shared/enums/tenant-status.enum';
import { finalize, Subject, takeUntil } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { TranslateService } from '@ngx-translate/core';

interface SelectedTenantRow {
  code: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const ALL_TENANTS_CODE = '';

@Component({
  selector: 'app-form-new-how-to',
  templateUrl: './form-new-how-to.component.html',
  styleUrls: ['./form-new-how-to.component.scss'],
})
export class FormNewHowToComponent implements OnInit, OnChanges, OnDestroy {
  @Input() howTo?: HowToModel;
  form!: FormGroup;

  tenantOptions: { name: string; code: string }[] = [];
  selectedTenants: SelectedTenantRow[] = [];

  isInvalid = isInvalid;
  hasError = hasError;

  private _tenantStatuses = new Map<string, 'ACTIVE' | 'INACTIVE'>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _howTo: HowToService,
    private _ui: UiService,
    private _router: Router,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this._loadTenants();

    this.form
      .get('tenant_ids')
      ?.valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe(() => this._syncSelectedTenants());
  }

  ngOnChanges(): void {
    if (this.howTo) {
      const tenantIds = this.howTo.tenant_ids ?? [];
      this.form.patchValue({
        title:       this.howTo.title,
        description: this.howTo.description,
        video:       this.howTo.video,
        tenant_ids:  tenantIds.length ? tenantIds : [ALL_TENANTS_CODE],
      });

      this._tenantStatuses = new Map(
        (this.howTo.tenants ?? []).map(t => [t._id, t.status ?? 'ACTIVE']),
      );
      this._syncSelectedTenants();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  initForm(): void {
    this.form = new FormGroup({
      title:       new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      video:       new FormControl(null, [Validators.required, youtubeLinkValidator()]),
      tenant_ids:  new FormControl([ALL_TENANTS_CODE]),
    });
  }

  private _loadTenants(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: resp => {
        if (resp.records.length === 0 && !this.howTo) {
          this._ui.showAlertWarning(this._t.instant('PORTAL.TENANTS.REQUIRED_BEFORE_ACTION'));
          this._router.navigateByUrl('portal-admin/tenants/list');
          return;
        }
        this.tenantOptions = [
          { code: ALL_TENANTS_CODE, name: this._t.instant('PORTAL.HOW_TO.FORM.ALL_TENANTS') },
          ...resp.records.map(t => ({ name: `${t.name} (${t.code})`, code: t._id })),
        ];
        this._syncSelectedTenants();
      }});
  }

  /**
   * Recomputes the "Status per tenant" rows from the current tenant_ids
   * selection. When "All tenants" is selected, every real tenant is shown
   * so its status can still be toggled individually, even though the
   * how-to itself stays globally scoped.
   *
   * Reads the individual control's own value (not `this.form.value`): a
   * child control's `valueChanges` fires before Angular has finished
   * recomputing the parent FormGroup's aggregated `.value`, so reading
   * `this.form.value.tenant_ids` from inside this subscription would see a
   * one-step-stale array.
   */
  _syncSelectedTenants(): void {
    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realTenantOptions = this.tenantOptions.filter(t => t.code !== ALL_TENANTS_CODE);

    const rows = isAllSelected
      ? realTenantOptions
      : realTenantOptions.filter(t => selectedIds.includes(t.code));

    this.selectedTenants = rows.map(t => ({
      code: t.code,
      name: t.name,
      status: this._tenantStatuses.get(t.code) ?? 'ACTIVE',
    }));
  }

  /**
   * Fired synchronously from the dropdown's own (changeSelection) output,
   * which emits the accurate just-clicked selection. Kept as an immediate,
   * redundant sync path alongside _syncSelectedTenants().
   */
  onTenantSelectionChange(selected: { name: string; code: string }[]): void {
    const isAllSelected = selected.some(o => o.code === ALL_TENANTS_CODE);
    const realTenantOptions = this.tenantOptions.filter(t => t.code !== ALL_TENANTS_CODE);
    const rows = isAllSelected
      ? realTenantOptions
      : selected.filter(o => o.code !== ALL_TENANTS_CODE);

    this.selectedTenants = rows.map(t => ({
      code: t.code,
      name: t.name,
      status: this._tenantStatuses.get(t.code) ?? 'ACTIVE',
    }));
  }

  toggleTenantStatus(tenantId: string): void {
    const current = this._tenantStatuses.get(tenantId) ?? 'ACTIVE';
    this._tenantStatuses.set(tenantId, current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    this._syncSelectedTenants();
  }

  private _resolveTenantIds(): string[] {
    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    return selectedIds.filter(id => id !== ALL_TENANTS_CODE);
  }

  private _buildTenantStatuses(): TenantStatusItem[] {
    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);

    if (isAllSelected) {
      // Globally-scoped how-to: only send explicit overrides, don't create
      // a tenant_order entry for every single tenant just because "All" was
      // checked — the backend already defaults missing entries to ACTIVE.
      return this.selectedTenants
        .filter(t => this._tenantStatuses.get(t.code) === 'INACTIVE')
        .map(t => ({ tenant_id: t.code, status: 'INACTIVE' as const }));
    }

    return this._resolveTenantIds().map(tenant_id => ({
      tenant_id,
      status: this._tenantStatuses.get(tenant_id) ?? 'ACTIVE',
    }));
  }

  send() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.howTo ? this._editData() : this._saveData();
  }

  private _saveData() {
    const req: CreateHowToRequest = {
      ...(this.form.value as CreateHowToRequest),
      tenant_ids: this._resolveTenantIds(),
      tenant_statuses: this._buildTenantStatuses(),
    };
    this._ui.showLoader();
    this._howTo
      .createHowTo(req)
      .pipe(finalize(() => this._ui.hideLoader()), takeUntil(this._destroy$))
      .subscribe({
        next: howTo => {
          this._reset();
          this._openSuccessModal(howTo, 'created');
        },
        error: () => {},
      });
  }

  private _editData() {
    const req: UpdateHowToRequest = {
      ...(this.form.value as UpdateHowToRequest),
      tenant_ids: this._resolveTenantIds(),
      tenant_statuses: this._buildTenantStatuses(),
    };
    this._ui.showLoader();
    this._howTo
      .editHowTo(req, this.howTo?._id ?? '')
      .pipe(finalize(() => this._ui.hideLoader()), takeUntil(this._destroy$))
      .subscribe({
        next: howTo => {
          this._reset();
          this._openSuccessModal(howTo, 'updated');
        },
        error: () => {},
      });
  }

  private _reset(): void {
    this.form.reset();
  }

  private _openSuccessModal(data: HowToModel, action: 'created' | 'updated') {
    const textKey = action === 'created' ? 'PORTAL.HOW_TO.CREATED_SUCCESS_TEXT' : 'PORTAL.HOW_TO.UPDATED_SUCCESS_TEXT';

    this._ui
      .showInformationModal({
        text: this._t.instant(textKey),
        title: this._t.instant('PORTAL.HOW_TO.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: `#${data.serial}`,
          url: ['/portal-admin/how-to', data.serial],
        },
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal-admin/how-to']);
        }
      });
  }

  cancelForm() {
    this._router.navigate(['/portal-admin/how-to']);
  }
}
