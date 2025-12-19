import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-internal-navbar',
  templateUrl: './internal-navbar.component.html',
  styleUrls: ['./internal-navbar.component.scss'],
})
export class InternalNavbarComponent implements OnDestroy {
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter();
  destroy$ = new Subject<void>();

  // use a stricter type so template is easier to reason about
  role: 'agent' | 'client' | 'admin' = 'agent';
  userName!: string;
  userId!: string;
  logo!: string | null;
  showLogo: boolean = false;

  // Map app roles -> navbar roles
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

  constructor(private _auth: AuthService) {
    this._auth.auth$.pipe(takeUntil(this.destroy$)).subscribe(auth => {
      if (!auth) {
        return;
      }

      const user = auth.user;
      const userRole = user.role as RolesEnum;

      this.userName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
      this.userId = user._id ?? '';

      // map to navbar role
      this.role = this.roleMap[userRole] ?? 'agent';

      // branding / logo – keep current behaviour for agent/client
      this.logo = user.agency?.logo_url ?? null;
      this.showLogo = user.agency?.check_branding ?? false;

      // If you DON'T want admin to show agency branding in navbar:
      // if (this.role === 'admin') {
      //   this.logo = null;
      //   this.showLogo = false;
      // }
    });
  }

  setToggleMenu(): void {
    this.toggleSidebar.emit(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
