import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { UploadFileService } from '@app/shared/services/upload_file.service';
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
  role: 'agent' | 'client' | 'admin' = 'agent';
  userName!: string;
  userId!: string;
  logo!: string | null;
  showLogo: boolean = false;

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

  constructor(
    private _auth: AuthService,
    private _uploadFile: UploadFileService
  ) {
    this._auth.auth$.pipe(takeUntil(this.destroy$)).subscribe(auth => {
      if (!auth) {
        return;
      }

      const user = auth.user;
      const userRole = user.role as RolesEnum;

      this.userName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
      this.userId = user._id ?? '';

      this.role = this.roleMap[userRole] ?? 'agent';

      this._uploadFile
        .getUrlFile(user.agency?.logo_url ?? '')
        .subscribe(url => {
          this.logo = url ?? '/assets/images/portal/image_default.webp';
        });
      this.showLogo = user.agency?.check_branding ?? false;
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
