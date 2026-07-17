import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { Subject, takeUntil } from 'rxjs';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { AdminTenantContextService } from 'src/app/shared/services/admin-tenant-context.service';

@Component({
  selector: 'app-internal-navbar',
  templateUrl: './internal-navbar.component.html',
  styleUrls: ['./internal-navbar.component.scss'],
})
export class InternalNavbarComponent implements OnDestroy {
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter();
  destroy$ = new Subject<void>();
  role: 'agent' | 'client' | 'admin' = 'agent';
  isTenantAdmin = false;
  userName!: string;
  userId!: string;
  logo!: string | null;
  showLogo: boolean = false;
  logoLoadError = false;

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
    private _uploadFile: UploadFileService,
    private readonly _tenantsService: TenantsService,
    private readonly _ctx: AdminTenantContextService,
  ) {
    this._auth.auth$.pipe(takeUntil(this.destroy$)).subscribe(auth => {
      if (!auth) return;

      const user = auth.user;
      const userRole = user.role as RolesEnum;

      this.userName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
      this.userId = user._id ?? '';
      this.role = this.roleMap[userRole] ?? 'agent';

      if (userRole === RolesEnum.ADMIN && user.managed_tenant_id) {
        this.isTenantAdmin = true;
        this._tenantsService
          .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: resp => {
              const assigned = resp.records.find(t => t._id === user.managed_tenant_id);
              if (assigned) this._ctx.setTenant(assigned);
            },
          });
      } else {
        this.isTenantAdmin = false;
      }

      if (user.agency?.logo_url) {
        this.logoLoadError = false;
        this._uploadFile.getUrlFile(user.agency?.logo_url).subscribe({
          next: url => (this.logo = url),
          error: () => (this.logoLoadError = true),
        });
        this.showLogo = user.agency?.check_branding ?? false;
      }
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
