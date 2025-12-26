import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  template: `
    <mat-form-field appearance="outline" class="w-100">
      <mat-label>{{ placeholder }}</mat-label>
      <input
        type="text"
        matInput
        [formControl]="formControl"
        [matAutocomplete]="auto"
        (blur)="onTouched()" />
      <mat-autocomplete #auto="matAutocomplete">
        <mat-option *ngFor="let option of options" [value]="option">
          {{ option }}
        </mat-option>
      </mat-autocomplete>
      <mat-error *ngIf="formControl.invalid && formControl.touched">
        {{ errorMessage }}
      </mat-error>
    </mat-form-field>
  `,
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() options: { id: string; name: string }[] = [];
  @Input() formControl!: FormControl;
  @Input() errorMessage: string = '';
  @Input() stylingClasses: string | string[] = '';

  private _value: string | null = null;

  onTouched: () => void = () => {};

  // ControlValueAccessor methods
  writeValue(value: string | null): void {
    this._value = value;
    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange: (value: string | null) => void = () => {};

  get combinedClasses(): string[] {
    const baseClass = 'app-input';
    const additionalClasses = Array.isArray(this.stylingClasses)
      ? this.stylingClasses
      : this.stylingClasses.split(' ').filter(cls => cls.trim() !== '');
    return [baseClass, ...additionalClasses];
  }

  // Manually update the form control when a new value is selected
  onOptionSelected(value: string) {
    this._value = value;
    this.onChange(this._value); // Notify the form control of the change
  }
}
