import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { InternalMenuItemModel } from '../internal-menu-item-model';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';

@Component({
  selector: 'app-internal-menu-options',
  templateUrl: './internal-menu-options.component.html',
  styleUrls: ['./internal-menu-options.component.scss'],
})
export class InternalMenuOptionsComponent implements OnDestroy, OnInit {
  @Input() item!: InternalMenuItemModel;
  destroy$ = new Subject<void>();

  role: 'agent' | 'client' | 'admin' = 'agent';
  isSelected: boolean = false;

  private roleMap: Record<RolesEnum, 'agent' | 'client' | 'admin'> = {
    [RolesEnum.INSURED]: 'client',
    [RolesEnum.PREREGISTER_INSURED]: 'client',

    [RolesEnum.ADMIN]: 'admin',

    [RolesEnum.AGENCY_BROKER]: 'agent',
    [RolesEnum.INDEPENDANT_BROKER]: 'agent',
    [RolesEnum.AGENCY_ADMINISTRATOR]: 'agent',
    [RolesEnum.AGENCY_OWNER]: 'agent',
    [RolesEnum.PREREGISTER_USER]: 'agent',
  };

  constructor(private router: Router, private _auth: AuthService) {
    const auth = this._auth.getAuth();
    const userRole = auth?.user.role as RolesEnum | undefined;

    if (userRole && this.roleMap[userRole]) {
      this.role = this.roleMap[userRole];
    } else {
      this.role = 'agent';
    }
  }

  ngOnInit(): void {
    this.isSelected = this._isRouteActive();

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => (this.isSelected = this._isRouteActive()));
  }

  private _isRouteActive(): boolean {
    const url = this.item.url;
    return url ? this.router.url.includes(url) : this.isSomeChildrenActive();
  }

  public isSomeChildrenActive(): boolean {
    return (this.item.options ?? []).some(option =>
      this.router.url.includes(option.url ?? '')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
