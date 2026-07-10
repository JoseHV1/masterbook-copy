import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  CreatePolicyCategoryRequest,
  PolicyCategoryModel,
} from 'src/app/shared/interfaces/models/policy-category.model';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { DocumentLanguageEnum } from 'src/app/shared/enums/document-language.enum';

const ALL_TENANTS_CODE = '';

@Component({
  selector: 'app-policy-category-form',
  templateUrl: './policy-category-form.component.html',
  styleUrls: ['./policy-category-form.component.scss'],
})
export class PolicyCategoryFormComponent implements OnInit, OnDestroy {
  @Input() category: PolicyCategoryModel | null = null;
  @Output() formSubmit = new EventEmitter<CreatePolicyCategoryRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  businessLineOptions: { name: string; code: string }[] = [];
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
    private _dataset: DatasetsService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    this._buildForm();
    if (this.category) this._patchForm(this.category);
    this._loadOptions();

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
      business_line_ids: [[], [Validators.required]],
      tenant_ids: [[ALL_TENANTS_CODE]],
    });
    // Always start with at least one name field present (Spanish by
    // default) so there's never a window — while tenants are still loading —
    // where no name control exists at all and Validators.required can't do
    // its job.
    this.form.addControl(
      this.nameControlName(DocumentLanguageEnum.ES),
      this._fb.control(null, [Validators.required]),
    );
    this.activeLanguages = [DocumentLanguageEnum.ES];
  }

  private _patchForm(category: PolicyCategoryModel): void {
    (category.tenants ?? []).forEach(t => {
      this._tenantStatusMap[t._id] = (t.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE';
    });
    this._pendingNameTranslations = category.name_translations ?? null;
    const tenantIds = category.tenant_ids ?? [];
    this.form.patchValue({
      business_line_ids: category.business_line_ids ?? [],
      tenant_ids: tenantIds.length ? tenantIds : [ALL_TENANTS_CODE],
    });
    // _buildForm() always creates the initial name_es control before the
    // category is known. _applyLanguageFields() only (re)prefills a name
    // control when the recomputed active languages differ from that
    // initial [ES] default — so for the common case of a category scoped
    // to Spanish-speaking tenants (recomputed langs === [ES], same set),
    // the prefill logic never runs and the field stays empty. Patch it
    // directly here as the initial value.
    const initialLang = DocumentLanguageEnum.ES;
    this.form
      .get(this.nameControlName(initialLang))
      ?.setValue(this._pendingNameTranslations?.[initialLang] ?? category.name ?? null);
  }

  private _loadOptions(): void {
    this._dataset
      .getBusinessLinesDataset()
      .pipe(takeUntil(this._destroy$))
      .subscribe(lines => {
        this.businessLineOptions = lines.map(l => ({ name: l.name, code: l._id }));
      });

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

  /**
   * When "All tenants" is selected, every real tenant is still shown so its
   * status can be toggled individually, even though the category itself
   * stays globally scoped.
   */
  _syncSelectedTenants(): void {
    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realTenantOptions = this.tenantOptions.filter(t => t.code !== ALL_TENANTS_CODE);

    this.selectedTenants = isAllSelected
      ? realTenantOptions
      : realTenantOptions.filter(t => selectedIds.includes(t.code));
  }

  /**
   * Fired synchronously from the dropdown's own (changeSelection) output,
   * which emits the accurate just-clicked selection BEFORE it propagates
   * through the ControlValueAccessor up to this.form (that propagation via
   * valueChanges lags one tick behind). Using the emitted payload directly
   * avoids reading a stale tenant_ids value.
   */
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
    // A tenant going inactive for this record can remove the last speaker of
    // a language from the active set — recompute which name fields are needed.
    this._recomputeActiveLanguages();
  }

  nameControlName(lang: DocumentLanguageEnum): string {
    return `name_${lang}`;
  }

  languageLabel(lang: DocumentLanguageEnum): string {
    const key = lang === DocumentLanguageEnum.ES ? 'LANGUAGE_ES' : 'LANGUAGE_EN';
    return this._t.instant(`PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.${key}`);
  }

  /**
   * Recomputes which languages need a name field: the distinct
   * document_language of the currently selected tenants that are ACTIVE for
   * THIS record (an inactive-for-this-record tenant's language is ignored
   * unless another active tenant shares it). Falls back to every selected
   * tenant's language if none are active yet (so the field never disappears
   * entirely), and to Spanish if nothing is selected at all.
   */
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
        this.category?.name ??
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

    // Globally-scoped category: only send explicit overrides, don't force
    // a tenant_statuses entry for every tenant just because "All" was
    // checked — the backend already defaults missing entries to ACTIVE.
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
      business_line_ids: this.form.value.business_line_ids,
      tenant_ids: tenantIds,
      tenant_statuses,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
