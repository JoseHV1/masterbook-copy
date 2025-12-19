import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AvailableLanguagesEnum } from '../enums/available-languages.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private availableLangs: AvailableLanguagesEnum[] = [
    AvailableLanguagesEnum.es,
    AvailableLanguagesEnum.en,
  ];

  private currentLang = new BehaviorSubject<AvailableLanguagesEnum>(
    this.availableLangs[0]
  );
  private currentLang$ = this.currentLang.asObservable();
  private localStorage: Storage | null = null;
  private storageLangPropName = 'MASTERBOOK_LANG';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(this.availableLangs);
    this.translate.setDefaultLang(this.availableLangs[0]);

    AppComponent.isBrowser.subscribe(isBrowser => {
      if (isBrowser) {
        this.localStorage = localStorage;
        const storageLang = this.localStorage.getItem(this.storageLangPropName);
        if (storageLang) {
          this.currentLang.next(storageLang as AvailableLanguagesEnum);
          this.translate.setDefaultLang(storageLang as AvailableLanguagesEnum);
        }
      }
    });
  }

  changeLanguage(lang: AvailableLanguagesEnum): void {
    this.currentLang.next(lang);
    this.translate.setDefaultLang(lang);
    if (this.localStorage) {
      this.localStorage.setItem(this.storageLangPropName, lang);
    }
  }

  getCurrentLanguage(): Observable<AvailableLanguagesEnum> {
    return this.currentLang$;
  }

  getAvailableLanguages(): AvailableLanguagesEnum[] {
    return this.availableLangs;
  }
}
