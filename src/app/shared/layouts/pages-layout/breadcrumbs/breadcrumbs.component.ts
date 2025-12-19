import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnDestroy {
  destroy$: Subject<void> = new Subject();
  menuItems!: any[];
  homeLinks = ['portal', 'portal-client'];

  constructor(private router: Router) {
    this.menuItems = [];
    const urlInitial = this.router.url.split('?')[0];
    this.mapUrlToItems(urlInitial);

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((item: any) => {
        const url = item.url.split('?')[0];
        this.mapUrlToItems(url);
      });
  }

  mapUrlToItems(url: string) {
    this.menuItems = url
      .split('/')
      .filter((item: any) => !!item && item != '')
      .map((item: string) => {
        const formattedItem = !this.homeLinks.includes(item)
          ? item
              .split('-')
              .map(word => this.capitalizeFirstLetter(word))
              .join(' ')
          : 'Home';

        return {
          label: formattedItem,
          routerLink: url.split(item)[0] + item,
        };
      });
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
