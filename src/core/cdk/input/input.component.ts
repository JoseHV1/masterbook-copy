import { Component, Input, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() inputMask?: string;
  @Input() maskSuffix?: string;
  @Input() maskPrefix?: string;
  @Input() isTextArea: boolean = false;
  @Input() rows: number = 3;
  @Input() clearable: boolean = false;
  @Input() dataTestId?: string;

  form: FormGroup;
  disabled = false;
  errors: string[] = [];
  errorMessage = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    @Self() @Optional() public currentControl: NgControl,
    private _translate: TranslateService
  ) {
    if (this.currentControl) {
      this.currentControl.valueAccessor = this;
    }
    this.form = new FormGroup({
      value: new FormControl(null),
    });
  }

  changeValue(): void {
    const rawValue = this.form.get('value')?.value;
    const value =
      this.inputMask === 'separator.2' ? parseFloat(rawValue) : rawValue;

    this.onChange(value);
    this.updateErrors();
  }

  clearValue(event: MouseEvent): void {
    event.stopPropagation();
    this.form.get('value')?.setValue(null);
    this.onChange(null);
    this.onTouched();
    this.updateErrors();
  }

  updateErrors(): void {
    if (this.currentControl) {
      const controlErrors = this.currentControl.errors;
      this.errors = Object.keys(controlErrors ?? {}).map(err =>
        err.toUpperCase()
      );

      this.form.get('value')?.setErrors(controlErrors);

      this.errorMessage = this.errors.length
        ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
        : '';
    }
  }

  writeValue(value: any): void {
    this.form.get('value')?.setValue(value, { emitEvent: false });
    this.updateErrors();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const control = this.form.get('value');
    isDisabled ? control?.disable() : control?.enable();
  }
}
