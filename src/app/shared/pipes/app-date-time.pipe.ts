import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TenantContextService } from '../services/tenant-context.service';

@Pipe({ name: 'appDateTime', pure: false })
export class AppDateTimePipe implements PipeTransform {
  constructor(
    private _datePipe: DatePipe,
    private _tenantCtx: TenantContextService,
  ) {}

  transform(
    value: Date | string | number | null | undefined,
    mode: 'date' | 'time' | 'datetime' = 'datetime',
  ): string | null {
    if (value == null) return null;
    const tenant = this._tenantCtx.snapshot;
    const dateFormat = this._toAngularDateFormat(tenant?.date_format);
    const timeFormat = tenant?.time_format === '12h' ? 'hh:mm a' : 'HH:mm';
    const format =
      mode === 'date' ? dateFormat :
      mode === 'time' ? timeFormat :
      `${dateFormat} ${timeFormat}`;
    return this._datePipe.transform(value, format);
  }

  private _toAngularDateFormat(format?: string): string {
    const map: Record<string, string> = {
      'MM/DD/YYYY': 'MM/dd/yyyy',
      'DD/MM/YYYY': 'dd/MM/yyyy',
      'YYYY-MM-DD': 'yyyy-MM-dd',
      'DD-MM-YYYY': 'dd-MM-yyyy',
      'MM-DD-YYYY': 'MM-dd-yyyy',
      'YYYY/MM/DD': 'yyyy/MM/dd',
      'DD.MM.YYYY': 'dd.MM.yyyy',
      'MM.DD.YYYY': 'MM.dd.yyyy',
    };
    return (format && map[format]) ?? 'dd/MM/yyyy';
  }
}
