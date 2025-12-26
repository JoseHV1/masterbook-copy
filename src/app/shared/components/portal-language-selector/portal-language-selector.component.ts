import { Component, OnDestroy, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { AvailableLanguagesEnum } from '../../enums/available-languages.enum';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-portal-language-selector',
  templateUrl: './portal-language-selector.component.html',
  styleUrls: ['./portal-language-selector.component.scss'],
})
export class PoprtalLanguageSelectorComponent implements OnDestroy {
  @Input() color: 'white' | 'blue-light' = 'blue-light';
  destroy$ = new Subject<void>();
  availableLangs: AvailableLanguagesEnum[] = [];
  currentLang: AvailableLanguagesEnum = AvailableLanguagesEnum.es;
  isOpen = false;

  constructor(private languageService: LanguageService) {
    this.availableLangs = languageService.getAvailableLanguages();
    this.languageService
      .getCurrentLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentLang => (this.currentLang = currentLang));
  }

  changeLang(event: any, lang: AvailableLanguagesEnum): void {
    this.languageService.changeLanguage(lang);
    this.isOpen = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
