import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportFilters } from '../../../../shared/models/report.models';
import { DatasetsService } from '@app/shared/services/dataset.service';
import { DropdownOptionModel } from '@app/shared/models/dropdown-option.model';
import {
  DateRangePreset,
  ReportType,
  CONFIG_BY_TYPE,
} from '../../../../shared/models/report.models';

@Component({
  selector: 'app-report-config',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss'],
})
export class ReportConfigComponent implements OnInit {
  @Input() initialValue: Partial<ReportFilters> | null = null;
  @Output() preview = new EventEmitter<ReportFilters>();
  @Output() generate = new EventEmitter<ReportFilters>();
  @Output() changed = new EventEmitter<ReportFilters>();

  form!: FormGroup;
  accountsOptions!: DropdownOptionModel[];
  dropDownInsurers!: DropdownOptionModel[];
  dropDownBrokers!: DropdownOptionModel[];
  dropDownBusinessLine!: DropdownOptionModel[];
  dropDownPolicyCategory: DropdownOptionModel[] = [];
  dropDownPolicyType: DropdownOptionModel[] = [];
  dropDownReportType: DropdownOptionModel[] = [];
  dropDownDateRange: DropdownOptionModel[] = [];
  dropDownStatus: DropdownOptionModel[] = [];
  dropDownGroupBy: DropdownOptionModel[] = [];
  dropDownAggregate: DropdownOptionModel[] = [];
  dropDownSort: DropdownOptionModel[] = [];

  show: any = {};

  constructor(private fb: FormBuilder, private _datasets: DatasetsService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      reportType: [null, Validators.required],

      // Date Presets + Range
      dateRange: [
        (this.initialValue as any)?.dateRange ?? ('last_30' as DateRangePreset),
        Validators.required,
      ],
      effectiveFrom: [this.initialValue?.effectiveFrom ?? null],
      effectiveTo: [this.initialValue?.effectiveTo ?? null],

      // Core filters
      businessLine: [this.initialValue?.businessLine ?? ''],
      policyCategory: [
        { value: this.initialValue?.policyCategory ?? '', disabled: true },
      ],
      policyType: [
        { value: this.initialValue?.policyType ?? '', disabled: true },
      ],
      status: [this.initialValue?.status ?? ''],
      broker: [this.initialValue?.broker ?? ''],
      insurer: [this.initialValue?.insurer ?? ''],
      minPrimeAmount: [this.initialValue?.minPrimeAmount ?? null],
      maxPrimeAmount: [this.initialValue?.maxPrimeAmount ?? null],
      minCoverage: [this.initialValue?.minCoverage ?? null],
      maxCoverage: [this.initialValue?.maxCoverage ?? null],
      minDeductible: [this.initialValue?.minDeductible ?? null],
      maxDeductible: [this.initialValue?.maxDeductible ?? null],

      // Ops
      groupBy: [this.initialValue?.groupBy ?? ''],
      aggregate: [this.initialValue?.aggregate ?? ''],
      sort: [this.initialValue?.sort ?? 'date_desc'],
      format: [this.initialValue?.format ?? 'xlsx', Validators.required],
    });

    // React to report type changes
    this.form.get('reportType')!.valueChanges.subscribe((t: ReportType) => {
      this.applyReportTypeConfig(t);
      this.emitChanged();
    });

    this.form.get('businessLine')?.valueChanges.subscribe(value => {
      this.dropDownPolicyCategory = [];
      this.dropDownPolicyType = [];
      this.form.get('policyCategory')?.setValue(null);
      this.form.get('policyType')?.setValue(null);

      if (value) {
        this._datasets.getPolicyCategoriesDataset(value).subscribe({
          next: policyCategory => {
            this.dropDownPolicyCategory = policyCategory.map(item => ({
              code: item._id,
              name: item.name,
            }));
          },
        });
      }
    });

    this.form.get('policyCategory')?.valueChanges.subscribe(value => {
      this.dropDownPolicyType = [];
      this.form.get('policyType')?.setValue(null);

      const businessLineSelected = this.form.get('businessLine')?.value;

      if (value) {
        this._datasets
          .getPolicyTypesDataset(businessLineSelected, value)
          .subscribe({
            next: policyType => {
              this.dropDownPolicyType = policyType.map(item => ({
                code: item._id,
                name: item.name,
              }));
            },
          });
      }
    });

    // React to Date preset changes
    this.form
      .get('dateRange')!
      .valueChanges.subscribe((preset: DateRangePreset) => {
        this.applyDatePreset(preset);
        this.emitChanged();
      });

    this.form.get('aggregate')?.valueChanges.subscribe(aggregateValue => {
      const groupByControl = this.form.get('groupBy');

      if (
        aggregateValue &&
        (!groupByControl?.value || groupByControl.value === '')
      ) {
        groupByControl?.setErrors({ requiredForAggregate: true });
      } else {
        if (groupByControl?.hasError('requiredForAggregate')) {
          const errors = { ...groupByControl.errors };
          delete errors['requiredForAggregate'];
          groupByControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    });

    // Initial date preset application
    this.applyDatePreset(this.form.get('dateRange')!.value as DateRangePreset);

    // Emit on any change (after our own normalizations)
    this.form.valueChanges.subscribe(() => this.emitChanged());

    this.fillDatasets();
  }

  private fillDatasets() {
    //Select Report Type
    this.dropDownReportType = [
      { code: 'accounts', name: 'Accounts Report' },
      { code: 'policies', name: 'Policies Report' },
      { code: 'requests', name: 'Requests Report' },
      { code: 'quotes', name: 'Quotes Report' },
    ];

    //Select Date Range
    this.dropDownDateRange = [
      { code: 'last_7', name: 'Last 7 Days' },
      { code: 'last_30', name: 'Last 30 Days' },
      { code: 'last_90', name: 'Last 90 Days' },
      { code: 'ytd', name: 'Year to Date' },
      { code: 'custom', name: 'Custom Range' },
    ];

    // Select insurer
    this._datasets.getInsuranceCompaniesDataset().subscribe({
      next: companies => {
        this.dropDownInsurers = companies.map(item => ({
          code: item._id,
          name: item.name,
        }));
      },
    });

    // Select broker
    this._datasets.getBrokersDataset().subscribe({
      next: brokers => {
        this.dropDownBrokers = brokers.map(item => ({
          code: item._id,
          name: item.user
            ? `${item.user?.first_name} ${item.user?.last_name}`
            : '',
        }));
      },
    });

    // Select business line
    this._datasets.getBusinessLinesDataset().subscribe({
      next: businessLine => {
        this.dropDownBusinessLine = businessLine.map(item => ({
          code: item._id,
          name: item.name,
        }));
      },
    });
  }

  // Helper for the template
  get isCustomRange(): boolean {
    return this.form?.get('dateRange')?.value === 'custom';
  }

  private emitChanged() {
    this.changed.emit(this.value());
  }

  private applyReportTypeConfig(t: ReportType) {
    const cfg = CONFIG_BY_TYPE[t];

    // Recompute visibility
    this.show = {
      businessLine: !!cfg.show.businessLine,
      policyCategory: !!cfg.show.policyCategory,
      policyType: !!cfg.show.policyType,
      status: !!cfg.show.status,
      broker: !!cfg.show.broker,
      insurer: !!cfg.show.insurer,
      minPrimeAmount: !!cfg.show.minPrimeAmount,
      maxPrimeAmount: !!cfg.show.maxPrimeAmount,
      minCoverage: !!cfg.show.minCoverage,
      maxCoverage: !!cfg.show.maxCoverage,
      minDeductible: !!cfg.show.minDeductible,
      maxDeductible: !!cfg.show.maxDeductible,
      groupBy: !!cfg.show.groupBy,
      aggregate: !!cfg.show.aggregate,
      sort: !!cfg.show.sort,
    };

    // Options
    this.dropDownStatus = cfg.statusOptions ?? [];
    this.dropDownGroupBy = cfg.groupByOptions ?? [];
    this.dropDownAggregate = cfg.aggregateOptions ?? [];
    this.dropDownSort = cfg.sortOptions ?? [];

    // Enable/disable irrelevant controls and clear them
    const maybeToggle = (key: keyof ReportFilters, visible?: boolean) => {
      const c = this.form.get(key as string);
      if (!c) return;
      if (visible) {
        c.enable({ emitEvent: false });
      } else {
        c.disable({ emitEvent: false });
        c.setValue(this.defaultValueFor(key), { emitEvent: false });
      }
    };

    maybeToggle('businessLine', this.show.businessLine);
    maybeToggle('policyCategory', this.show.policyCategory);
    maybeToggle('policyType', this.show.policyType);
    maybeToggle('status', this.show.status);
    maybeToggle('broker', this.show.broker);
    maybeToggle('insurer', this.show.insurer);
    maybeToggle('minPrimeAmount', this.show.minPrimeAmount);
    maybeToggle('maxPrimeAmount', this.show.maxPrimeAmount);
    maybeToggle('minCoverage', this.show.minCoverage);
    maybeToggle('maxCoverage', this.show.maxCoverage);
    maybeToggle('minDeductible', this.show.minDeductible);
    maybeToggle('maxDeductible', this.show.maxDeductible);
    maybeToggle('groupBy', this.show.groupBy);
    maybeToggle('aggregate', this.show.aggregate);
    maybeToggle('sort', this.show.sort);
  }

  private defaultValueFor(key: keyof ReportFilters) {
    switch (key) {
      case 'minPrimeAmount':
        return null;
      case 'maxPrimeAmount':
        return null;
      case 'minCoverage':
        return null;
      case 'maxCoverage':
        return null;
      case 'minDeductible':
        return null;
      case 'maxDeductible':
        return null;
      default:
        return '';
    }
  }

  private applyDatePreset(preset: DateRangePreset) {
    const fromCtrl = this.form.get('effectiveFrom')!;
    const toCtrl = this.form.get('effectiveTo')!;

    if (preset === 'custom') {
      // Let the user pick; keep whatever they set
      fromCtrl.enable({ emitEvent: false });
      toCtrl.enable({ emitEvent: false });
      return;
    }

    const { from, to } = this.computeDates(preset);
    fromCtrl.setValue(from, { emitEvent: false });
    toCtrl.setValue(to, { emitEvent: false });
    fromCtrl.disable({ emitEvent: false });
    toCtrl.disable({ emitEvent: false });
  }

  // All dates at local midnight for stable comparisons
  private computeDates(preset: DateRangePreset): { from: Date; to: Date } {
    const today = this.atMidnight(new Date());
    const clone = (d: Date) => new Date(d.getTime());

    if (preset === 'ytd') {
      const start = this.atMidnight(new Date(today.getFullYear(), 0, 1));
      return { from: start, to: clone(today) };
    }

    const daysBack = preset === 'last_7' ? 6 : preset === 'last_30' ? 29 : 89;
    const from = this.addDays(today, -daysBack);
    return { from, to: clone(today) };
  }

  private atMidnight(d: Date): Date {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  }

  private addDays(d: Date, delta: number): Date {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + delta);
    return this.atMidnight(nd);
  }

  value(): ReportFilters {
    // getRawValue to include disabled date inputs when presets are used
    const v = this.form.getRawValue() as any;
    return v as ReportFilters;
  }

  toSlug(t: string): string {
    return t
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  }

  onPreview() {
    if (!this.form.valid) return;
    const v = this.value();
    if (v.businessLine && !v.policyType) return; // client-side guard
    this.preview.emit(v);
  }

  onGenerate() {
    if (!this.form.valid) return;
    const v = this.value();
    if (v.businessLine && !v.policyType) return; // client-side guard
    this.generate.emit(v);
  }
}
