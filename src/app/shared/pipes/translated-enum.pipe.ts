import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { capitalizeFirstLetter } from '../helpers/capitaliza-first-lettet';

@Pipe({ name: 'translatedEnum', pure: false })
export class TranslatedEnumPipe implements PipeTransform {
  constructor(private _translate: TranslateService) {}

  transform(value: string | null | undefined, prefix: string): string {
    if (!value) return '';

    const key = `${prefix}.${value}`;
    const translated = this._translate.instant(key);
    if (translated !== key) return translated;

    return value
      .split('_')
      .map(frag => capitalizeFirstLetter(frag.toLowerCase()))
      .join(' ');
  }
}
