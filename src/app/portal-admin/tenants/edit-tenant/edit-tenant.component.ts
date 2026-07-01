import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { UpdateTenantRequest } from 'src/app/shared/interfaces/requests/tenants/update-tenant.request';

@Component({
  selector: 'app-edit-tenant',
  templateUrl: './edit-tenant.component.html',
  styleUrls: ['./edit-tenant.component.scss'],
})
export class EditTenantComponent {
  tenant!: TenantModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _tenants: TenantsService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
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

  save(req: UpdateTenantRequest): void {
    this._ui.showLoader();
    this._tenants
      .update(this.tenant.serial, req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_UPDATED'));
          this._router.navigateByUrl(`portal-admin/tenants/${this.tenant.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_UPDATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl(`portal-admin/tenants/${this.tenant.serial}`);
  }
}
