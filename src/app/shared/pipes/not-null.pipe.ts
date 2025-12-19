import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notNull',
})
export class NotNullPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (!value) {
      return '---';
    }
    return value.toString();
  }
}
