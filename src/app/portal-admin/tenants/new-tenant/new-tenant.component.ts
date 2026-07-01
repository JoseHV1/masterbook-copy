import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreateTenantRequest } from 'src/app/shared/interfaces/requests/tenants/create-tenant.request';

@Component({
  selector: 'app-new-tenant',
  templateUrl: './new-tenant.component.html',
  styleUrls: ['./new-tenant.component.scss'],
})
export class NewTenantComponent {
  constructor(
    private readonly _tenants: TenantsService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {}

  create(req: CreateTenantRequest): void {
    this._ui.showLoader();
    this._tenants
      .create(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: tenant => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_CREATED'));
          this._router.navigateByUrl(`portal-admin/tenants/${tenant.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/tenants/list');
  }
}
