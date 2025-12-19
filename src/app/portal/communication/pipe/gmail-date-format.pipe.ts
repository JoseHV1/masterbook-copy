import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gmailDateFormat',
  standalone: true,
})
export class GmailDateFormatPipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
}
