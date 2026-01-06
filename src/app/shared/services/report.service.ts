import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ReportFilters } from '../models/report.models';
import { ApiService } from '../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type ApiResponseModel<T> = { data: T };
type DateRangePreset = 'last_7' | 'last_30' | 'last_90' | 'ytd' | 'custom';
type RangeAugment = {
  dateRange?: DateRangePreset;
  effectiveFrom?: Date | string | null;
  effectiveTo?: Date | string | null;
  location?: string | null;
};

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(
    private _api: ApiService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  createForm(initialValue: Partial<ReportFilters> | null): FormGroup {
    return this.fb.group({
      reportType: [null, Validators.required],

      // Date Presets + Range
      dateRange: [
        (initialValue as any)?.dateRange ?? ('last_30' as DateRangePreset),
        Validators.required,
      ],
      effectiveFrom: [initialValue?.effectiveFrom ?? null],
      effectiveTo: [initialValue?.effectiveTo ?? null],

      // Core filters
      businessLine: [initialValue?.businessLine ?? ''],
      policyCategory: [
        { value: initialValue?.policyCategory ?? '', disabled: true },
      ],
      policyType: [{ value: initialValue?.policyType ?? '', disabled: true }],
      status: [initialValue?.status ?? ''],
      broker: [initialValue?.broker ?? ''],
      account: [initialValue?.account ?? ''],
      insurer: [initialValue?.insurer ?? ''],
      paymentFrom: [initialValue?.paymentFrom ?? ''],
      paymentMethod: [initialValue?.paymentMethod ?? ''],
      minTotalAmount: [initialValue?.minTotalAmount ?? ''],
      maxTotalAmount: [initialValue?.maxTotalAmount ?? ''],
      minCommissionPay: [initialValue?.minCommissionPay ?? ''],
      maxCommissionPay: [initialValue?.maxCommissionPay ?? ''],
      minPrimeAmount: [initialValue?.minPrimeAmount ?? null],
      maxPrimeAmount: [initialValue?.maxPrimeAmount ?? null],
      minCoverage: [initialValue?.minCoverage ?? null],
      maxCoverage: [initialValue?.maxCoverage ?? null],
      minDeductible: [initialValue?.minDeductible ?? null],
      maxDeductible: [initialValue?.maxDeductible ?? null],

      // Ops
      groupBy: [initialValue?.groupBy ?? ''],
      aggregate: [initialValue?.aggregate ?? ''],
      sort: [initialValue?.sort ?? 'date_desc'],
      format: [initialValue?.format ?? 'xlsx', Validators.required],
    });
  }

  resetForm(form: FormGroup) {
    const reportType = form.get('reportType')?.value;

    form.reset(
      {
        reportType,
        dateRange: 'last_30',
        effectiveFrom: null,
        effectiveTo: null,
        businessLine: '',
        policyCategory: '',
        policyType: '',
        status: '',
        broker: '',
        account: '',
        insurer: '',
        paymentFrom: '',
        paymentMethod: '',
        minTotalAmount: null,
        maxTotalAmount: null,
        minCommissionPay: null,
        maxCommissionPay: null,
        minPrimeAmount: null,
        maxPrimeAmount: null,
        minCoverage: null,
        maxCoverage: null,
        minDeductible: null,
        maxDeductible: null,
        groupBy: '',
        aggregate: '',
        sort: 'date_desc',
        format: 'xlsx',
      },
      { emitEvent: false }
    );
  }

  getHistory() {
    return this._api
      .get<ApiResponseModel<{ items: any[] }>>('/reports/history')
      .pipe(map(r => r.data.items));
  }

  generatePreview(filters: ReportFilters) {
    const payload = this.toApiPayload(filters);
    return this._api
      .post<ApiResponseModel<{ item: any }>>('/reports/preview', payload)
      .pipe(map(r => r.data.item));
  }

  generateReport(
    filters: ReportFilters
  ): Observable<{ url: string; format?: string }> {
    const payload = this.toApiPayload(filters);
    return this._api
      .post<ApiResponseModel<{ item: { url: string; format?: string } }>>(
        '/reports/generate',
        payload
      )
      .pipe(map(r => r.data.item));
  }

  generateReportFile(filters: ReportFilters): Observable<Blob> {
    const payload = this.toApiPayload(filters);
    return this.http.post('/reports/generate-file', payload, {
      responseType: 'blob',
      observe: 'body',
    });
  }

  private mapRange(
    preset: DateRangePreset | undefined,
    from?: Date | string | null,
    to?: Date | string | null
  ): [string | undefined, string | undefined] {
    const toIso = (d: any) => {
      if (!d) return undefined;
      const dt = d instanceof Date ? d : new Date(d);
      const utc = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
      return utc.toISOString();
    };

    const now = new Date();

    switch (preset) {
      case 'last_7':
        return [toIso(new Date(now.getTime() - 7 * 86400000)), toIso(now)];
      case 'last_30':
        return [toIso(new Date(now.getTime() - 30 * 86400000)), toIso(now)];
      case 'last_90':
        return [toIso(new Date(now.getTime() - 90 * 86400000)), toIso(now)];
      case 'ytd':
        return [toIso(new Date(now.getFullYear(), 0, 1)), toIso(now)];
      case 'custom':
        return [toIso(from), toIso(to)];
      default:
        return [undefined, undefined];
    }
  }

  toApiPayload(f: ReportFilters & RangeAugment): any {
    const [startDate, endDate] = this.mapRange(
      f.dateRange,
      f.effectiveFrom,
      f.effectiveTo
    );

    const normalize = (val: any) =>
      val === undefined || val === null || val === '' ? undefined : val;

    return {
      reportType: normalize(f.reportType),
      format: normalize(f.format),
      range: [startDate, endDate],
      agencyId: normalize((f as any).agencyId),
      brokerId: normalize(f.broker),
      insurerId: normalize(f.insurer),
      accountId: normalize(f.account),
      paymentFrom: normalize(f.paymentFrom),
      paymentMethod: normalize(f.paymentMethod),
      businessLineId: normalize(f.businessLine),
      policyCategory: normalize(f.policyCategory),
      policyTypeId: normalize(f.policyType),
      status: normalize(f.status),
      location: normalize((f as any).location),
      minPrimeAmount: normalize(f.minPrimeAmount),
      maxPrimeAmount: normalize(f.maxPrimeAmount),
      minCoverage: normalize(f.minCoverage),
      maxCoverage: normalize(f.maxCoverage),
      minDeductible: normalize(f.minDeductible),
      maxDeductible: normalize(f.maxDeductible),
      minTotalAmount: normalize(f.minTotalAmount),
      maxTotalAmount: normalize(f.maxTotalAmount),
      groupBy: normalize(f.groupBy),
      aggregate: normalize(f.aggregate),
      sort: normalize(f.sort),
    };
  }
}
