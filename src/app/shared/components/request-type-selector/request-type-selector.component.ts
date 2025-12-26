import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownOptionModel } from '../../models/dropdown-option.model';
import { enumToDropDown } from '../../helpers/enum-to-dropdown.helper';
import { RequestType } from '../../enums/request-type.enum';

@Component({
  selector: 'app-request-type-selector',
  templateUrl: './request-type-selector.component.html',
  styleUrls: ['./request-type-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RequesTypeSelectorComponent),
      multi: true,
    },
  ],
})
export class RequesTypeSelectorComponent implements ControlValueAccessor {
  options: DropdownOptionModel[] = enumToDropDown(RequestType);
  disabled = false;
  value?: string;

  onChange: (value: any) => void | undefined = () => undefined;
  onTouch: (value: string) => void | undefined = () => undefined;

  changeValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    return;
  }
}
