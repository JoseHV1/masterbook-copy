import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  BusinessLineModel,
  CreateBusinessLineRequest,
} from 'src/app/shared/interfaces/models/business-line.model';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { DocumentLanguageEnum } from 'src/app/shared/enums/document-language.enum';

const ALL_TENANTS_CODE = '';

@Component({
  selector: 'app-business-line-form',
  templateUrl: './business-line-form.component.html',
  styleUrls: ['./business-line-form.component.scss'],
})
export class BusinessLineFormComponent implements OnInit, OnDestroy {
  @Input() businessLine: BusinessLineModel | null = null;
  @Output() formSubmit = new EventEmitter<CreateBusinessLineRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  tenantOptions: { name: string; code: string }[] = [];
  selectedTenants: { name: string; code: string }[] = [];
  /** Distinct languages currently required for the name, derived from the ACTIVE-for-this-record selected tenants. */
  activeLanguages: DocumentLanguageEnum[] = [];

  private _allTenants: TenantModel[] = [];
  private _pendingNameTranslations: { es?: string; en?: string } | null = null;
  private _tenantStatusMap: Record<string, 'ACTIVE' | 'INACTIVE'> = {};
  private _destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    if (this.businessLine) this._patchForm(this.businessLine);
    this._loadTenants();

    this.form
      .get('tenant_ids')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._syncSelectedTenants();
        this._recomputeActiveLanguages();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      description: [null],
      tenant_ids: [[ALL_TENANTS_CODE]],
    });
    // Prevents a window with no name control at all while tenants load.
    this.form.addControl(
      this.nameControlName(DocumentLanguageEnum.ES),
      this._fb.control(null, [Validators.required]),
    );
    this.activeLanguages = [DocumentLanguageEnum.ES];
  }

  private _patchForm(businessLine: BusinessLineModel): void {
    (businessLine.tenants ?? []).forEach(t => {
      this._tenantStatusMap[t._id] = (t.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE';
    });
    this._pendingNameTranslations = businessLine.name_translations ?? null;
    const tenantIds = businessLine.tenant_ids ?? [];
    this.form.patchValue({
      description: businessLine.description ?? null,
      tenant_ids: tenantIds.length ? tenantIds : [ALL_TENANTS_CODE],
    });
    // _applyLanguageFields() skips its prefill when langs stay [ES] — patch the initial control directly here too.
    const initialLang = DocumentLanguageEnum.ES;
    this.form
      .get(this.nameControlName(initialLang))
      ?.setValue(this._pendingNameTranslations?.[initialLang] ?? businessLine.name ?? null);
  }

  private _loadTenants(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe(resp => {
        this._allTenants = resp.records;
        this.tenantOptions = [
          {
            code: ALL_TENANTS_CODE,
            name: this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ALL_TENANTS'),
          },
          ...resp.records.map(t => ({ name: `${t.name} (${t.code})`, code: t._id })),
        ];
        this._syncSelectedTenants();
        this._recomputeActiveLanguages();
      });
  }

  // When "All tenants" is selected, every real tenant still shows so its status can be toggled individually.
  _syncSelectedTenants(): void {
    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realTenantOptions = this.tenantOptions.filter(t => t.code !== ALL_TENANTS_CODE);

    this.selectedTenants = isAllSelected
      ? realTenantOptions
      : realTenantOptions.filter(t => selectedIds.includes(t.code));
  }

  // Uses the dropdown's own emitted selection directly — reading form.get('tenant_ids').value here would be one tick stale.
  onTenantSelectionChange(selected: { name: string; code: string }[]): void {
    const isAllSelected = selected.some(o => o.code === ALL_TENANTS_CODE);
    const realTenantOptions = this.tenantOptions.filter(t => t.code !== ALL_TENANTS_CODE);
    this.selectedTenants = isAllSelected
      ? realTenantOptions
      : selected.filter(o => o.code !== ALL_TENANTS_CODE);
    this._recomputeActiveLanguages();
  }

  getTenantStatus(tenantId: string): 'ACTIVE' | 'INACTIVE' {
    return this._tenantStatusMap[tenantId] ?? 'ACTIVE';
  }

  toggleTenantStatus(tenantId: string): void {
    const current = this.getTenantStatus(tenantId);
    this._tenantStatusMap[tenantId] = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this._recomputeActiveLanguages();
  }

  nameControlName(lang: DocumentLanguageEnum): string {
    return `name_${lang}`;
  }

  languageLabel(lang: DocumentLanguageEnum): string {
    const key = lang === DocumentLanguageEnum.ES ? 'LANGUAGE_ES' : 'LANGUAGE_EN';
    return this._t.instant(`PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.${key}`);
  }

  // Distinct document_language of selected tenants ACTIVE for this record; falls back to all selected, then Spanish.
  private _recomputeActiveLanguages(): void {
    if (!this._allTenants.length) return;

    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realSelectedIds = selectedIds.filter(id => id !== ALL_TENANTS_CODE);

    const relevantTenants = isAllSelected
      ? this._allTenants
      : this._allTenants.filter(t => realSelectedIds.includes(t._id));

    const activeTenants = relevantTenants.filter(t => this.getTenantStatus(t._id) === 'ACTIVE');
    const source = activeTenants.length ? activeTenants : relevantTenants;

    let langs = Array.from(new Set(source.map(t => t.document_language)));
    if (!langs.length) langs = [DocumentLanguageEnum.ES];

    this._applyLanguageFields(langs);
  }

  private _applyLanguageFields(langs: DocumentLanguageEnum[]): void {
    const sameSet =
      langs.length === this.activeLanguages.length &&
      langs.every(l => this.activeLanguages.includes(l));
    if (sameSet) return;

    const preserved: Partial<Record<DocumentLanguageEnum, string>> = {};
    this.activeLanguages.forEach(l => {
      const c = this.form.get(this.nameControlName(l));
      if (c) preserved[l] = c.value;
    });

    this.activeLanguages.forEach(l => this.form.removeControl(this.nameControlName(l)));

    langs.forEach(l => {
      const prefill =
        preserved[l] ??
        this._pendingNameTranslations?.[l] ??
        this.businessLine?.name ??
        null;
      this.form.addControl(this.nameControlName(l), this._fb.control(prefill, [Validators.required]));
    });

    this.activeLanguages = langs;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const tenantIds = selectedIds.filter(id => id !== ALL_TENANTS_CODE);

    // Global scope: only send explicit INACTIVE overrides, not one entry per tenant.
    const tenant_statuses = isAllSelected
      ? this.selectedTenants
          .filter(t => this.getTenantStatus(t.code) === 'INACTIVE')
          .map(t => ({ tenant_id: t.code, status: 'INACTIVE' as const }))
      : tenantIds.map(tenant_id => ({
          tenant_id,
          status: this.getTenantStatus(tenant_id),
        }));

    const name_translations: { es?: string; en?: string } = {};
    this.activeLanguages.forEach(lang => {
      name_translations[lang] = this.form.get(this.nameControlName(lang))?.value;
    });
    const name =
      name_translations[DocumentLanguageEnum.ES] ||
      name_translations[DocumentLanguageEnum.EN] ||
      Object.values(name_translations).find(v => !!v) ||
      '';

    this.formSubmit.emit({
      name,
      name_translations,
      description: this.form.value.description ?? undefined,
      tenant_ids: tenantIds,
      tenant_statuses,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
