import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';

@Component({
  selector: 'app-address-input',
  templateUrl: 'address-input.component.html',
  styleUrls: ['address-input.component.scss'],
})
export class AddressInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string = '';
  @Output() updateAddress: EventEmitter<AddressAutocompleteModel | undefined> =
    new EventEmitter();
  @Input() dataTestId?: string;

  form: FormGroup;
  disabled = false;
  errors: string[] = [];
  errorMessage = '';
  value?: AddressAutocompleteModel;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _cd: ChangeDetectorRef
  ) {
    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  ngOnInit(): void {
    this.currentControl.control?.statusChanges.subscribe(() =>
      this.updateErrors()
    );
  }

  changeValue(): void {
    this.onChange(this.value);
    this.updateAddress.emit(this.value);
    this.currentControl.control?.parent?.updateValueAndValidity();
    this.updateErrors();
  }

  handleAddress(address: AddressAutocompleteModel): void {
    this.value = address;
    this.form.get('value')?.setValue(address.address);
    this.changeValue();
  }

  resetAddress($event: KeyboardEvent): void {
    const validKeys = ['Backspace', 'Delete'];
    if (
      !MyMasterbookValidators.alphanumericPattern.test($event.key) &&
      !validKeys.includes($event.key)
    ) {
      return;
    }
    this.value = undefined;
    this.changeValue();
  }

  updateErrors(): void {
    this.errors = Object.keys(this.currentControl.errors ?? {}).map(err =>
      err.toUpperCase()
    );
    this.form.get('value')?.setErrors(this.currentControl.errors);

    if (this.currentControl.control?.touched) {
      this.form.get('value')?.markAsTouched();
    }

    this.errorMessage = this.errors.length
      ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
      : '';
    this._cd.detectChanges();
  }

  writeValue(value: AddressAutocompleteModel): void {
    this.value = value;
    this.form.get('value')?.setValue(value?.address ?? undefined);
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
}
