import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { UiService } from './shared/services/ui.service';
import { AuthService } from './shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from './shared/services/language.service';
import { TenantsService } from './shared/services/tenants.service';
import { TenantContextService } from './shared/services/tenant-context.service';

declare var gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  static isBrowser = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private _ui: UiService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _language: LanguageService, //No eliminar esto, es para inicializar el LanguageService
    private _router: Router,
    private _tenants: TenantsService,
    private _tenantCtx: TenantContextService,
  ) {
    const auth = this._auth.getAuth();
    if (!!auth) {
      this._auth.refreshAuth().pipe(
        switchMap(() => this._tenants.getForCurrentAgency()),
        takeUntil(this.destroy$),
      ).subscribe({
        next: tenant => {
          this._tenantCtx.setTenant(tenant);
          this._language.setFromTenant(tenant);
        },
        error: () => {},
      });
    }

    AppComponent.isBrowser.next(isPlatformBrowser(this.platformId));

    this._ui.loaderVisible$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: boolean) => {
        this.isLoading = resp;
        this._cd.detectChanges();
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleAnalytics();
    }
  }

  private initGoogleAnalytics(): void {
    const analyticsId = environment.GOOGLE_ANALYTICS_KEY;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function () {
      (window as any).dataLayer.push(arguments);
    };

    gtag('js', new Date());

    this._router.events
      .pipe(
        filter(
          (event: RouterEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        gtag('config', analyticsId, {
          page_path: event.urlAfterRedirects,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
