import { Component, forwardRef } from '@angular/core';
import {
  RequestTypeModel,
  RequestTypes,
} from 'src/app/shared/models/request-type.model';
import { REQUEST_TYPE_DATASET } from './type-selector.dataset';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeSelectorComponent),
      multi: true,
    },
  ],
})
export class TypeSelectorComponent implements ControlValueAccessor {
  typesDataset: RequestTypeModel[] = REQUEST_TYPE_DATASET;
  value?: RequestTypeModel;

  onChange: (value: any) => void | undefined = () => undefined;
  onTouch: (value: string) => void | undefined = () => undefined;

  changeValue(type: RequestTypeModel): void {
    this.value = type;
    this.onChange(type.type);
  }

  writeValue(value: RequestTypes): void {
    this.value = this.typesDataset.find(item => item.type === value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    return;
  }
}
