import { Component, Input, forwardRef } from '@angular/core';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox-field',
  template: `
    <mat-checkbox [formControl]="formControl">
      {{ placeholder }}
    </mat-checkbox>
  `,
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() formControl!: FormControl;
  @Input() stylingClasses: string | string[] = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  // Implement the required methods for ControlValueAccessor
  writeValue(value: any): void {
    // Check if the value has changed to avoid unnecessary updates
    if (value !== this.formControl?.value) {
      this.formControl?.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    // Store the callback function
    this.onChange = fn;
    // Subscribe to formControl valueChanges
    this.formControl?.valueChanges.subscribe(value => {
      // Call the callback only if the value has changed
      if (value !== this.formControl?.value) {
        this.onChange(value);
      }
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get combinedClasses(): string[] {
    const baseClass = 'app-input';
    const additionalClasses = Array.isArray(this.stylingClasses)
      ? this.stylingClasses
      : this.stylingClasses.split(' ').filter(cls => cls.trim() !== '');
    return [baseClass, ...additionalClasses];
  }
}
