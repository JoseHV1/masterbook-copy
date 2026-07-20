import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BREADCRUMB_LABELS } from './breadcrumb-labels.map';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnDestroy {
  destroy$: Subject<void> = new Subject();
  menuItems!: any[];
  homeLinks = ['portal', 'portal-client'];
  private currentUrl: string;

  constructor(private router: Router, private translate: TranslateService) {
    this.menuItems = [];
    this.currentUrl = this.router.url.split('?')[0];
    this.mapUrlToItems(this.currentUrl);

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((item: any) => {
        this.currentUrl = item.url.split('?')[0];
        this.mapUrlToItems(this.currentUrl);
      });

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.mapUrlToItems(this.currentUrl));
  }

  mapUrlToItems(url: string) {
    this.menuItems = url
      .split('/')
      .filter((item: any) => !!item && item != '')
      .map((item: string) => {
        const formattedItem = this.homeLinks.includes(item)
          ? this.translateOrFallback('SHARED.BREADCRUMBS.HOME', 'Home')
          : this.translateSegment(item);

        return {
          label: formattedItem,
          routerLink: url.split(item)[0] + item,
        };
      });
  }

  private translateSegment(item: string): string {
    const key = BREADCRUMB_LABELS[item];
    if (key) {
      const translated = this.translate.instant(key);
      if (translated !== key) return translated;
    }

    return item
      .split('-')
      .map(word => this.capitalizeFirstLetter(word))
      .join(' ');
  }

  private translateOrFallback(key: string, fallback: string): string {
    const translated = this.translate.instant(key);
    return translated !== key ? translated : fallback;
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
