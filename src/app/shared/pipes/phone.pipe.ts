import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  transform(value: string, format: string = 'standard'): string {
    if (!value) {
      return '';
    }

    const cleanNumber = value.replace(/\D/g, '');

    switch (format) {
      case 'standard':
        if (cleanNumber.length === 10) {
          return `(${cleanNumber.substring(0, 3)}) ${cleanNumber.substring(
            3,
            6
          )}-${cleanNumber.substring(6)}`;
        }
        break;
      case 'area':
        if (cleanNumber.length === 10) {
          return `(${cleanNumber.substring(0, 3)}) ${cleanNumber.substring(
            3,
            10
          )}`;
        }
        break;
      default:
        return value;
    }

    return value;
  }
}
