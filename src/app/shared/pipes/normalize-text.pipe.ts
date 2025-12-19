import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalizeText',
  pure: true,
})
export class NormalizeTextPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || typeof value !== 'string') return '';

    // Replace underscores with spaces, lower case everything
    let formatted = value.replace(/_/g, ' ').toLowerCase();

    // Fix common incorrect spellings
    formatted = formatted.replace(/\bpayed\b/gi, 'paid');

    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
