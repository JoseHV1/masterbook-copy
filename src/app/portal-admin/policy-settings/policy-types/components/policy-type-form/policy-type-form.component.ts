import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  CreatePolicyTypeRequest,
  PolicyTypeModel,
} from 'src/app/shared/interfaces/models/policy-type.model';
import { PolicyCategoryModel } from 'src/app/shared/interfaces/models/policy-category.model';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { DocumentLanguageEnum } from 'src/app/shared/enums/document-language.enum';

const ALL_TENANTS_CODE = '';

@Component({
  selector: 'app-policy-type-form',
  templateUrl: './policy-type-form.component.html',
  styleUrls: ['./policy-type-form.component.scss'],
})
export class PolicyTypeFormComponent implements OnInit, OnDestroy {
  @Input() policyType: PolicyTypeModel | null = null;
  @Output() formSubmit = new EventEmitter<CreatePolicyTypeRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  businessLineOptions: { name: string; code: string }[] = [];
  policyCategoryOptions: { name: string; code: string }[] = [];
  tenantOptions: { name: string; code: string }[] = [];
  selectedTenants: { name: string; code: string }[] = [];
  tenantScopeRestricted = false;
  businessLineScopeRestricted = false;
  policyCategoryScopeRestricted = false;
  typeOptions = Object.values(ProductTypeEnum).map(t => ({ name: t, code: t }));
  /** Distinct languages currently required for the name, derived from the ACTIVE-for-this-record selected tenants. */
  activeLanguages: DocumentLanguageEnum[] = [];

  private _categories: PolicyCategoryModel[] = [];
  private _allBusinessLines: BusinessLineModel[] = [];
  private _allTenants: TenantModel[] = [];
  private _allTenantOptions: { name: string; code: string }[] = [];
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
    if (this.policyType) this._patchForm(this.policyType);
    this._loadOptions();

    this.form
      .get('policy_category_id')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe(categoryId => this._applyCategoryTenantScope(categoryId));

    this.form
      .get('tenant_ids')!
      .valueChanges.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._syncSelectedTenants();
        this._recomputeActiveLanguages();
        this._recomputeBusinessLineOptions();
        this._recomputePolicyCategoryOptions();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      naic_code: [null, [Validators.required]],
      type: [null, [Validators.required]],
      business_line_id: [null, [Validators.required]],
      policy_category_id: [null, [Validators.required]],
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

  private _patchForm(policyType: PolicyTypeModel): void {
    (policyType.tenants ?? []).forEach(t => {
      this._tenantStatusMap[t._id] = (t.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE';
    });
    this._pendingNameTranslations = policyType.name_translations ?? null;
    const tenantIds = policyType.tenant_ids ?? [];
    this.form.patchValue({
      naic_code: policyType.naic_code,
      type: policyType.type,
      business_line_id: policyType.business_line_id,
      policy_category_id: policyType.policy_category_id,
      tenant_ids: tenantIds.length ? tenantIds : [ALL_TENANTS_CODE],
    });
    // _buildForm() always creates the initial name_es control before the
    // policy type is known. _applyLanguageFields() only (re)prefills a name
    // control when the recomputed active languages differ from that
    // initial [ES] default — so for the common case of a type scoped to
    // Spanish-speaking tenants (recomputed langs === [ES], same set), the
    // prefill logic never runs and the field stays empty. Patch it
    // directly here as the initial value.
    const initialLang = DocumentLanguageEnum.ES;
    this.form
      .get(this.nameControlName(initialLang))
      ?.setValue(this._pendingNameTranslations?.[initialLang] ?? policyType.name ?? null);
  }

  private _loadOptions(): void {
    this._dataset
      .getBusinessLinesDataset()
      .pipe(takeUntil(this._destroy$))
      .subscribe(lines => {
        this._allBusinessLines = lines;
        this._recomputeBusinessLineOptions();
      });

    this._dataset
      .getPolicyCategoriesDataset()
      .pipe(takeUntil(this._destroy$))
      .subscribe(categories => {
        this._categories = categories;
        this._recomputePolicyCategoryOptions();
        this._applyCategoryTenantScope(this.form.get('policy_category_id')!.value);
      });

    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe(resp => {
        this._allTenants = resp.records;
        this._allTenantOptions = [
          {
            code: ALL_TENANTS_CODE,
            name: this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ALL_TENANTS'),
          },
          ...resp.records.map(t => ({ name: `${t.name} (${t.code})`, code: t._id })),
        ];
        this._applyCategoryTenantScope(this.form.get('policy_category_id')!.value);
      });
  }

  /**
   * Business lines shown for selection are scoped to the currently
   * selected tenant(s): a business line is eligible if it's global
   * (tenant_ids empty) or scoped to at least one of the selected tenants.
   * When "All tenants" is selected, every business line is eligible. Any
   * previously selected business line that falls out of scope after a
   * tenant change is dropped.
   */
  private _recomputeBusinessLineOptions(): void {
    if (!this._allBusinessLines.length) return;

    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realSelectedIds = selectedIds.filter(id => id !== ALL_TENANTS_CODE);

    this.businessLineScopeRestricted = !isAllSelected;
    const eligibleLines = isAllSelected
      ? this._allBusinessLines
      : this._allBusinessLines.filter(
          l => !l.tenant_ids?.length || l.tenant_ids.some(id => realSelectedIds.includes(id)),
        );

    this.businessLineOptions = eligibleLines.map(l => ({ name: l.name, code: l._id }));

    const businessLineControl = this.form.get('business_line_id')!;
    if (businessLineControl.value && !this.businessLineOptions.some(o => o.code === businessLineControl.value)) {
      businessLineControl.setValue(null);
    }
  }

  /**
   * Same tenant-scoping rule as business lines, applied to the policy
   * category select: a category is eligible if it's global or scoped to at
   * least one of the currently selected tenants.
   */
  private _recomputePolicyCategoryOptions(): void {
    if (!this._categories.length) return;

    const selectedIds: string[] = this.form.get('tenant_ids')!.value ?? [];
    const isAllSelected = selectedIds.includes(ALL_TENANTS_CODE);
    const realSelectedIds = selectedIds.filter(id => id !== ALL_TENANTS_CODE);

    this.policyCategoryScopeRestricted = !isAllSelected;
    const eligibleCategories = isAllSelected
      ? this._categories
      : this._categories.filter(
          c => !c.tenant_ids?.length || c.tenant_ids.some(id => realSelectedIds.includes(id)),
        );

    this.policyCategoryOptions = eligibleCategories.map(c => ({ name: c.name, code: c._id }));

    const categoryControl = this.form.get('policy_category_id')!;
    if (categoryControl.value && !this.policyCategoryOptions.some(o => o.code === categoryControl.value)) {
      categoryControl.setValue(null);
    }
  }

  /**
   * A policy type can never be scoped to a tenant its parent policy category
   * isn't scoped to. When the category is global (no tenant_ids), any tenant
   * — including the "All tenants" option — is a valid choice; otherwise the
   * tenant options are narrowed down to the category's own tenants (the "All
   * tenants" option is dropped, since the type can never be broader than its
   * restricted parent) and any already-selected tenant outside that set is
   * removed.
   */
  private _applyCategoryTenantScope(categoryId: string | null): void {
    const category = this._categories.find(c => c._id === categoryId);
    const scopedTenantIds = category?.tenant_ids ?? [];

    if (!scopedTenantIds.length) {
      this.tenantScopeRestricted = false;
      this.tenantOptions = this._allTenantOptions;
      this._syncSelectedTenants();
      this._recomputeActiveLanguages();
      return;
    }

    this.tenantScopeRestricted = true;
    this.tenantOptions = this._allTenantOptions.filter(t => scopedTenantIds.includes(t.code));

    const tenantIdsControl = this.form.get('tenant_ids')!;
    const currentSelection: string[] = tenantIdsControl.value ?? [];
    let allowedSelection = currentSelection.filter(id => scopedTenantIds.includes(id));

    // A type can never be broader than its category — but it also can't be
    // left with an empty selection under a restricted category (the backend
    // rejects that). If narrowing the previous selection (which may have
    // been "All tenants" or tenants outside this category) leaves nothing
    // valid, default to every tenant the category itself allows instead of
    // collapsing to [] (which would silently mean "global").
    if (!allowedSelection.length) {
      allowedSelection = [...scopedTenantIds];
    }

    if (
      allowedSelection.length !== currentSelection.length ||
      !allowedSelection.every(id => currentSelection.includes(id))
    ) {
      tenantIdsControl.setValue(allowedSelection);
    } else {
      this._syncSelectedTenants();
      this._recomputeActiveLanguages();
    }
  }

  /**
   * When "All tenants" is selected, every real tenant currently in scope is
   * still shown so its status can be toggled individually, even though the
   * type itself stays globally scoped.
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
    this._recomputeBusinessLineOptions();
    this._recomputePolicyCategoryOptions();
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
        this.policyType?.name ??
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

    // Globally-scoped type: only send explicit overrides, don't force a
    // tenant_statuses entry for every tenant just because "All" was
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
      naic_code: this.form.value.naic_code,
      type: this.form.value.type,
      business_line_id: this.form.value.business_line_id,
      policy_category_id: this.form.value.policy_category_id,
      tenant_ids: tenantIds,
      tenant_statuses,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
