import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
})
export class CurrencyMaskDirective {
  private previousValue: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let input = this.el.nativeElement.value;

    // Remove non-numeric characters except dot
    const cleanValue = input.replace(/[^0-9.]/g, '');

    if (!cleanValue) {
      this.updateValue('', null);
      return;
    }

    const [integer, decimal] = cleanValue.split('.');
    let formatted = this.formatNumber(integer);

    if (decimal !== undefined) {
      formatted += '.' + decimal.slice(0, 2); // max 2 decimal places
    }

    // Update the displayed value
    this.updateValue(`$${formatted}`, parseFloat(cleanValue));
  }

  @HostListener('blur')
  onBlur() {
    const controlValue = this.control.control?.value;
    if (controlValue !== null && !isNaN(controlValue)) {
      const formatted = `$${Number(controlValue).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      this.renderer.setProperty(this.el.nativeElement, 'value', formatted);
    }
  }

  private formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private updateValue(display: string, numeric: number | null) {
    this.renderer.setProperty(this.el.nativeElement, 'value', display);
    this.control.control?.setValue(numeric, { emitEvent: false });
  }
}
