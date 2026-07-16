import { Component, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TenantContextService } from 'src/app/shared/services/tenant-context.service';
import { AdminTenantContextService } from 'src/app/shared/services/admin-tenant-context.service';
import { TenantDateAdapter, TENANT_DATE_FORMATS } from './date-input.adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  providers: [
    TenantDateAdapter,
    { provide: DateAdapter, useExisting: TenantDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: TENANT_DATE_FORMATS },
  ],
})
export class DateInputComponent implements ControlValueAccessor, OnDestroy {
  @Input() placeholder?: string;
  @Input() min?: Date;
  @Input() max?: Date;

  innerControl = new FormControl<Date | null>(null);

  private _onChange: (v: Date | null) => void = () => {};
  _onTouched: () => void = () => {};
  private _sub: Subscription;

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _tenantCtx: TenantContextService,
    private _adminCtx: AdminTenantContextService,
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
    this._sub = this.innerControl.valueChanges.subscribe(val => this._onChange(val));
  }

  get resolvedPlaceholder(): string {
    if (this.placeholder) return this.placeholder;
    return (this._tenantCtx.snapshot ?? this._adminCtx.snapshot)?.date_format ?? 'MM/DD/YYYY';
  }

  writeValue(val: Date | null): void {
    this.innerControl.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled
      ? this.innerControl.disable({ emitEvent: false })
      : this.innerControl.enable({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
