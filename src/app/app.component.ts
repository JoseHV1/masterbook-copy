import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { UiService } from './shared/services/ui.service';
import { LanguageService } from './shared/services/language.service';
import { NavigationService } from './shared/services/navigation.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  static isBrowser = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();

  isLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _language: LanguageService,
    private _navigation: NavigationService,
    private _auth: AuthService
  ) {
    const auth = this._auth.getAuth();
    if (!!auth) this._auth.refreshAuth().subscribe();

    AppComponent.isBrowser.next(isPlatformBrowser(this.platformId));

    this._ui.loaderVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: boolean) => {
        this.isLoading = resp;
        this._cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
