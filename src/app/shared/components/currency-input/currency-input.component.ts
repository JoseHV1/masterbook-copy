import { Component, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TenantContextService } from 'src/app/shared/services/tenant-context.service';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
})
export class CurrencyInputComponent implements ControlValueAccessor, OnDestroy {
  @Input() clearable = false;

  innerControl = new FormControl<number | null>(null);
  maskPattern: string;
  prefix = '';
  suffix = '';
  thousandSeparator: string;
  decimalMarker: '.' | ',';
  placeholder: string;

  private _onChange: (v: number | null) => void = () => {};
  _onTouched: () => void = () => {};
  private _sub: Subscription;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _tenantCtx: TenantContextService,
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;

    const tenant = this._tenantCtx.snapshot;
    const dp = tenant?.currency_decimal_places ?? 2;
    this.maskPattern = `separator.${dp}`;
    this.thousandSeparator = tenant?.currency_thousands_separator ?? ',';
    this.decimalMarker = (tenant?.currency_decimal_separator ?? '.') as '.' | ',';

    const symbol = tenant?.currency_symbol ?? '$';
    if (tenant?.currency_symbol_position === 'after') {
      this.suffix = ` ${symbol}`;
    } else {
      this.prefix = `${symbol} `;
    }

    this.placeholder = this._buildPlaceholder();
    this._sub = this.innerControl.valueChanges.subscribe(v => this._onChange(v));
  }

  writeValue(val: number | null): void {
    this.innerControl.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: (v: number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this.innerControl.disable() : this.innerControl.enable();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  private _buildPlaceholder(): string {
    const tenant = this._tenantCtx.snapshot;
    if (!tenant?.currency_symbol) return '0';
    const {
      currency_symbol,
      currency_symbol_position,
      currency_decimal_places = 2,
      currency_thousands_separator = ',',
      currency_decimal_separator = '.',
    } = tenant;
    const [intPart, decPart] = (1000).toFixed(currency_decimal_places).split('.');
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, currency_thousands_separator);
    const formatted = currency_decimal_places > 0
      ? `${intFormatted}${currency_decimal_separator}${decPart}`
      : intFormatted;
    return currency_symbol_position === 'after'
      ? `${formatted} ${currency_symbol}`
      : `${currency_symbol} ${formatted}`;
  }
}
