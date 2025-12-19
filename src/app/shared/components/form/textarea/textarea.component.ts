import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder?: string;
  @Input() widthValue: string = '100%';
  @Input() heightValue: string = '130px';
  @Input() marginValue: string = '0px';
  value!: string;
  disabled: boolean = false;
  hidePlaceholder: boolean = false;

  constructor() {}

  onChange: (value: any) => void | undefined = () => undefined;
  onTouch: (value: string) => void | undefined = () => undefined;

  changeText($event: any): void {
    this.onChange($event);
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
  }
}
