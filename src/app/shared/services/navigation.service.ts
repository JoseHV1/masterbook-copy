import { Injectable } from '@angular/core';
import { NavigationTypeEnum } from '../enums/navigation-type.enum';
import { NavigationStart, RouteConfigLoadStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private navigationType: NavigationTypeEnum = NavigationTypeEnum.EXTERNAL;

  constructor(private _router: Router) {
    this._router.events.subscribe(event => {
      this.navigationType = NavigationTypeEnum.INTERNAL;
    });
  }

  wasNavigationInternal(): boolean {
    return this.navigationType === NavigationTypeEnum.INTERNAL;
  }
}
