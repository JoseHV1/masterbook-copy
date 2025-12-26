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
  @Input() marginValue: string = '0px';
  value!: string;
  diseable: boolean = false;
  hidePlaceholder: boolean = false;

  constructor() {}

  onChange: (_: string) => void | undefined = () => undefined;
  onTouched: () => void | undefined = () => undefined;

  writeValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }
  registerOnChange(fn: string): void {
    this.onChange(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.diseable = isDisabled;
  }
}
