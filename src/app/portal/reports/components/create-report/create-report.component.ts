import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReportFilters } from '../../../../shared/models/report.models';
import { DatasetsService } from '@app/shared/services/dataset.service';
import { DropdownOptionModel } from '@app/shared/models/dropdown-option.model';
import {
  DateRangePreset,
  ReportType,
  CONFIG_BY_TYPE,
} from '../../../../shared/models/report.models';
import { ReportService } from '@app/shared/services/report.service';

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

  form: FormGroup = new FormGroup({});
  accountsOptions!: DropdownOptionModel[];
  dropDownAccounts!: DropdownOptionModel[];
  dropDownpaymentFrom!: DropdownOptionModel[];
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

  constructor(
    private _datasets: DatasetsService,
    private _report: ReportService
  ) {}

  ngOnInit(): void {
    this.form = this._report.createForm(this.initialValue);

    this.form.get('reportType')!.valueChanges.subscribe((t: ReportType) => {
      this.resetAllFieldsExceptReportType();
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

    const reportTypeControl = this.form.get('reportType');
    const insurerControl = this.form.get('insurer');
    const accountControl = this.form.get('account');

    insurerControl?.valueChanges.subscribe(value => {
      if (!reportTypeControl) return;

      const type = reportTypeControl.value;
      if ((type === 'payments' || type === 'invoices') && value) {
        accountControl?.setValue(null, { emitEvent: false });
        accountControl?.disable({ emitEvent: false });
      } else if ((type === 'payments' || type === 'invoices') && !value) {
        accountControl?.enable({ emitEvent: false });
      }
    });

    accountControl?.valueChanges.subscribe(value => {
      if (!reportTypeControl) return;

      const type = reportTypeControl.value;
      if ((type === 'payments' || type === 'invoices') && value) {
        insurerControl?.setValue(null, { emitEvent: false });
        insurerControl?.disable({ emitEvent: false });
      } else if ((type === 'payments' || type === 'invoices') && !value) {
        insurerControl?.enable({ emitEvent: false });
      }
    });

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

    this.form.valueChanges.subscribe(() => this.emitChanged());

    this.fillDatasets();

    this.applyDatePreset(this.form.get('dateRange')!.value as DateRangePreset);
  }

  resetAllFieldsExceptReportType() {
    this._report.resetForm(this.form);
    this.dropDownPolicyCategory = [];
    this.dropDownPolicyType = [];
  }

  private fillDatasets() {
    //Select Report Type
    this.dropDownReportType = [
      { code: 'accounts', name: 'Accounts Report' },
      { code: 'policies', name: 'Policies Report' },
      { code: 'requests', name: 'Requests Report' },
      { code: 'quotes', name: 'Quotes Report' },
      { code: 'payments', name: 'Payments Report' },
      { code: 'invoices', name: 'Invoices Report' },
      { code: 'commissions', name: 'Commissions Report' },
    ];

    //Select Date Range
    this.dropDownDateRange = [
      { code: 'last_7', name: 'Last 7 Days' },
      { code: 'last_30', name: 'Last 30 Days' },
      { code: 'last_90', name: 'Last 90 Days' },
      { code: 'ytd', name: 'Year to Date' },
      { code: 'custom', name: 'Custom Range' },
    ];

    // Select payment from
    this.dropDownpaymentFrom = this.addAllOption([
      { code: 'Account', name: 'Account' },
      { code: 'Insurer', name: 'Insurer' },
    ]);

    // Select insurer
    this._datasets.getInsuranceCompaniesDataset().subscribe({
      next: companies => {
        this.dropDownInsurers = this.addAllOption(
          companies.map(item => ({ code: item._id, name: item.name }))
        );
      },
    });

    // Select broker
    this._datasets.getBrokersDataset().subscribe({
      next: brokers => {
        this.dropDownBrokers = this.addAllOption(
          brokers.map(item => ({
            code: item._id,
            name: item.user
              ? `${item.user?.first_name} ${item.user?.last_name}`
              : '',
          }))
        );
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

    // Account
    this._datasets.getAccountDataset().subscribe({
      next: accounts => {
        this.dropDownAccounts = this.addAllOption(
          accounts.map(item => ({ code: item._id, name: item.account_name }))
        );
      },
    });
  }

  get isCustomRange(): boolean {
    return this.form?.get('dateRange')?.value === 'custom';
  }

  private emitChanged() {
    this.changed.emit(this.value());
  }

  private applyReportTypeConfig(t: ReportType) {
    const cfg = CONFIG_BY_TYPE[t];

    this.show = {
      businessLine: !!cfg.show.businessLine,
      policyCategory: !!cfg.show.policyCategory,
      policyType: !!cfg.show.policyType,
      status: !!cfg.show.status,
      broker: !!cfg.show.broker,
      insurer: !!cfg.show.insurer,
      account: !!cfg.show.account,
      paymentFrom: !!cfg.show.paymentFrom,
      minTotalAmount: !!cfg.show.minTotalAmount,
      maxTotalAmount: !!cfg.show.maxTotalAmount,
      minCommissionPay: !!cfg.show.minCommissionPay,
      maxCommissionPay: !!cfg.show.maxCommissionPay,
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
    maybeToggle('account', this.show.account);
    maybeToggle('paymentFrom', this.show.paymentFrom);
    maybeToggle('minTotalAmount', this.show.minTotalAmount);
    maybeToggle('maxTotalAmount', this.show.maxTotalAmount);
    maybeToggle('minCommissionPay', this.show.minCommissionPay);
    maybeToggle('maxCommissionPay', this.show.maxCommissionPay);
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
      case 'minTotalAmount':
        return null;
      case 'maxTotalAmount':
        return null;
      case 'minCommissionPay':
        return null;
      case 'maxCommissionPay':
        return null;
      default:
        return '';
    }
  }

  private applyDatePreset(preset: DateRangePreset) {
    const fromCtrl = this.form.get('effectiveFrom')!;
    const toCtrl = this.form.get('effectiveTo')!;

    if (preset === 'custom') {
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
    if (v.businessLine && !v.policyType) return;
    this.preview.emit(v);
  }

  onGenerate() {
    if (!this.form.valid) return;
    const v = this.value();
    if (v.businessLine && !v.policyType) return;
    this.generate.emit(v);
  }

  onPaymentFromChange(selected: any[]): void {
    const selectedCode = selected?.[0]?.code;
    const insurerControl = this.form.get('insurer');
    const accountControl = this.form.get('account');

    if (selectedCode === 'Insurer' && insurerControl) {
      accountControl?.setValue(null, { emitEvent: false });
      accountControl?.disable({ emitEvent: false });
      insurerControl?.enable({ emitEvent: false });
    } else if (selectedCode === 'Account' && accountControl) {
      insurerControl?.setValue(null, { emitEvent: false });
      insurerControl?.disable({ emitEvent: false });
      accountControl?.enable({ emitEvent: false });
    } else {
      insurerControl?.enable({ emitEvent: false });
      accountControl?.enable({ emitEvent: false });
    }
  }

  private addAllOption(
    options: DropdownOptionModel[],
    label: string = 'All'
  ): DropdownOptionModel[] {
    return [{ code: 'All', name: label }, ...options];
  }
}
