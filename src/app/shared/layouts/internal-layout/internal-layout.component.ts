import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RolesEnum } from '../../enums/roles.enum';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-internal-layout',
  templateUrl: './internal-layout.component.html',
  styleUrls: ['./internal-layout.component.scss'],
})
export class InternalLayoutComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  openMenu = true;
  sidebarVisible: boolean = false;
  role: 'agent' | 'client' | 'admin' = 'agent';

  private layoutRoleMap: Record<RolesEnum, 'agent' | 'client' | 'admin'> = {
    [RolesEnum.INSURED]: 'client',
    [RolesEnum.PREREGISTER_INSURED]: 'client',

    [RolesEnum.ADMIN]: 'admin',

    [RolesEnum.AGENCY_BROKER]: 'agent',
    [RolesEnum.INDEPENDANT_BROKER]: 'agent',
    [RolesEnum.AGENCY_ADMINISTRATOR]: 'agent',
    [RolesEnum.AGENCY_OWNER]: 'agent',
    [RolesEnum.PREREGISTER_USER]: 'agent',
  };

  constructor(private _auth: AuthService, private router: Router) {
    this._auth.auth$.pipe(takeUntil(this.destroy$)).subscribe(auth => {
      const userRole = auth?.user.role as RolesEnum | undefined;

      if (userRole && this.layoutRoleMap[userRole]) {
        this.role = this.layoutRoleMap[userRole];
      } else {
        this.role = 'agent';
      }
    });

    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (window.innerWidth <= 768) {
          this.sidebarVisible = false;
        }
      });
  }

  toggleMenu() {
    this.openMenu = !this.openMenu;
    this.sidebarVisible = this.openMenu;
  }

  ngOnInit(): void {
    document.body.classList.add('portal-layout-active');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('portal-layout-active');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
