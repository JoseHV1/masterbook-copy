import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../services/language.service';

interface TranslatableName {
  name: string;
  name_translations?: { es?: string; en?: string };
}

@Pipe({
  name: 'translatedName',
  pure: false,
})
export class TranslatedNamePipe implements PipeTransform, OnDestroy {
  private _currentLang: 'es' | 'en' = 'es';
  private _sub: Subscription;

  constructor(private _language: LanguageService) {
    this._sub = this._language
      .getCurrentLanguage()
      .subscribe(lang => (this._currentLang = lang as 'es' | 'en'));
  }

  transform(entity: TranslatableName | null | undefined): string {
    if (!entity) return '';
    return entity.name_translations?.[this._currentLang] || entity.name;
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
