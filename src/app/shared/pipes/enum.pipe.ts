import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeFirstLetter } from '../helpers/capitaliza-first-lettet';

@Pipe({
  name: 'enum',
})
export class EnumPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value
      .split('_')
      .map(frag => capitalizeFirstLetter(frag.toLowerCase()))
      .join(' ');
  }
}
