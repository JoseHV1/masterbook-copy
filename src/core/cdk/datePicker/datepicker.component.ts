import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-date-field',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
})
export class DateFieldComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() set min(value: Date) {
    this.minDate = value;
  }
  @Input() set max(value: Date) {
    this.maxDate = value;
  }
  @Input() dataTestId?: string;

  minDate?: Date;
  maxDate?: Date;

  form: FormGroup;
  disabled = false;
  errors: string[] = [];
  errorMessage = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService
  ) {
    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  changeValue(): void {
    this.onChange(this.form.value.value);
    this.updateErrors();
  }

  updateErrors(): void {
    this.errors = Object.keys(this.currentControl.errors ?? {}).map(err =>
      err.toUpperCase()
    );
    this.form.get('value')?.setErrors(this.currentControl.errors);
    this.errorMessage = this.errors.length
      ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
      : '';
  }

  writeValue(value: any): void {
    this.form.get('value')?.setValue(value);
    this.updateErrors();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.form.get('value')?.disable()
      : this.form.get('value')?.enable();
  }
}
