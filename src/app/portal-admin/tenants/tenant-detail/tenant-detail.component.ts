import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss'],
})
export class TenantDetailComponent {
  tenant!: TenantModel;
  TenantStatusEnum = TenantStatusEnum;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _tenants: TenantsService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _t: TranslateService,
  ) {
    this._loadTenant();
  }

  private _loadTenant(): void {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._tenants.getOne(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: tenant => (this.tenant = tenant),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/tenants/list');
        },
      });
  }

  goToEdit(): void {
    this._router.navigateByUrl(`portal-admin/tenants/${this.tenant.serial}/edit`);
  }

  goBack(): void {
    this._location.back();
  }

  confirmEnable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_ENABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeEnable();
      });
  }

  private _executeEnable(): void {
    this._ui.showLoader();
    this._tenants
      .enable(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.tenant = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_ENABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_ENABLE')),
      });
  }

  confirmDisable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DISABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDisable();
      });
  }

  private _executeDisable(): void {
    this._ui.showLoader();
    this._tenants
      .disable(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.tenant = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DISABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DISABLE')),
      });
  }

  confirmHardDelete(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeHardDelete();
      });
  }

  private _executeHardDelete(): void {
    this._ui.showLoader();
    this._tenants
      .hardDelete(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/tenants/list');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DELETE')),
      });
  }
}
