import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() icon?: string;
  @Input() placeholder?: string;
  @Input() align?: 'center' | 'start' = 'start';
  @Input() dataTestId?: string;

  value!: string;
  disabled: boolean = false;
  hidePlaceholder: boolean = false;

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
