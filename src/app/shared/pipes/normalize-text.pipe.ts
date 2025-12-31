import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeText',
  pure: true,
})
export class NormalizeTextPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') return '';
    let formatted = value.replace(/_/g, ' ').toLowerCase();
    formatted = formatted.replace(/\bpayed\b/gi, 'paid');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
