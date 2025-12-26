import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dropdown-field',
  templateUrl: 'dropdown.component.html',
  styleUrls: ['dropdown.component.scss'],
})
export class DropdownComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string = '';
  @Input() multiple: boolean = false;
  @Input() options: DropdownOption[] = [];
  @Output() changeSelection: EventEmitter<DropdownOption[]> =
    new EventEmitter();

  form: FormGroup;
  disabled = false;
  errors: string[] = [];
  errorMessage = '';

  onChange = (_: any) => {};
  onTouched: () => void = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService
  ) {
    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  ngOnInit(): void {
    this.resetDisabledState();
  }

  changeValue(): void {
    const control = this.form.get('value');
    if (!control) return;

    let selected = control.value;

    if (this.multiple && Array.isArray(selected)) {
      const allSelected = selected.includes('');

      if (allSelected && selected.length === 1) {
        this.options = this.options.map(opt => ({
          ...opt,
          disabled: opt.code !== '',
        }));

        const allOption = this.options.find(opt => opt.code === '');
        if (allOption) this.changeSelection.emit([allOption]);
      } else {
        this.options = this.options.map(opt => ({
          ...opt,
          disabled: opt.code === '' && selected.length > 0,
        }));

        const selectedItems = this.options.filter(opt =>
          selected.includes(opt.code)
        );
        this.changeSelection.emit(selectedItems);
      }
    } else {
      const completeItem = this.options.find(opt => opt.code === selected);
      if (completeItem) this.changeSelection.emit([completeItem]);
    }

    this.onChange(control.value);
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
    this.resetDisabledState();
    this.form.get('value')?.setValue(value, { emitEvent: false });
    this.updateErrors();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.form.get('value')?.disable()
      : this.form.get('value')?.enable();
  }

  private resetDisabledState(): void {
    this.options = this.options.map(opt => ({
      ...opt,
      disabled: false,
    }));
  }
}

export interface DropdownOption {
  name: string;
  code: string;
  disabled?: boolean;
}
