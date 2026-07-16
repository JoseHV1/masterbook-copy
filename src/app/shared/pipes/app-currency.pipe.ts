import { Pipe, PipeTransform } from '@angular/core';
import { TenantContextService } from '../services/tenant-context.service';

@Pipe({ name: 'appCurrency', pure: false })
export class AppCurrencyPipe implements PipeTransform {
  constructor(private _tenantCtx: TenantContextService) {}

  transform(value: number | null | undefined): string {
    if (value == null) return '—';
    const tenant = this._tenantCtx.snapshot;
    if (!tenant?.currency_symbol) return value.toString();

    const {
      currency_symbol,
      currency_symbol_position,
      currency_decimal_places = 2,
      currency_thousands_separator = ',',
      currency_decimal_separator = '.',
    } = tenant;

    const [intPart, decPart] = value.toFixed(currency_decimal_places).split('.');
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency_thousands_separator);
    const formatted =
      currency_decimal_places > 0
        ? `${intFormatted}${currency_decimal_separator}${decPart}`
        : intFormatted;

    return currency_symbol_position === 'after'
      ? `${formatted} ${currency_symbol}`
      : `${currency_symbol} ${formatted}`;
  }
}
