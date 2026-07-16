import { Injectable, Optional, Inject } from '@angular/core';
import { NativeDateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import { TenantContextService } from 'src/app/shared/services/tenant-context.service';
import { AdminTenantContextService } from 'src/app/shared/services/admin-tenant-context.service';

export const TENANT_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: null,
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

const DEFAULT_FORMAT = 'MM/DD/YYYY';

@Injectable()
export class TenantDateAdapter extends NativeDateAdapter {
  constructor(
    private _tenantCtx: TenantContextService,
    private _adminCtx: AdminTenantContextService,
    @Optional() @Inject(MAT_DATE_LOCALE) matDateLocale: string,
    platform: Platform,
  ) {
    super(matDateLocale, platform);
  }

  private get _activeFmt(): string {
    return (this._tenantCtx.snapshot ?? this._adminCtx.snapshot)?.date_format ?? DEFAULT_FORMAT;
  }

  override format(date: Date, _displayFormat: any): string {
    return this._applyFormat(date, this._activeFmt);
  }

  override parse(value: any, _parseFormat: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return this.isValid(value) ? value : null;
    return this._parseByFormat(String(value), this._activeFmt);
  }

  private _applyFormat(date: Date, format: string): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear());
    return format
      .replace('YYYY', y)
      .replace('DD', d)
      .replace('MM', m);
  }

  private _parseByFormat(value: string, format: string): Date | null {
    const sep = ['/', '-', '.'].find(s => value.includes(s)) ?? null;
    if (!sep) return null;

    const parts = value.split(sep);
    if (parts.length !== 3) return null;

    const fmtU = format.toUpperCase();
    const order = [
      { label: 'D', pos: fmtU.indexOf('DD') },
      { label: 'M', pos: fmtU.indexOf('MM') },
      { label: 'Y', pos: fmtU.indexOf('YYYY') },
    ].sort((a, b) => a.pos - b.pos);

    const map: Record<string, string> = {};
    order.forEach((o, i) => (map[o.label] = parts[i]));

    const day = parseInt(map['D'], 10);
    const month = parseInt(map['M'], 10) - 1;
    const year = parseInt(map['Y'], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
}
