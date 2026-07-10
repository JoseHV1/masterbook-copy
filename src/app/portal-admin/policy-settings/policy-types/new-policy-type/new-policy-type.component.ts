import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminPolicyTypeService } from 'src/app/shared/services/admin-policy-type.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreatePolicyTypeRequest } from 'src/app/shared/interfaces/models/policy-type.model';

@Component({
  selector: 'app-new-policy-type',
  templateUrl: './new-policy-type.component.html',
  styleUrls: ['./new-policy-type.component.scss'],
})
export class NewPolicyTypeComponent {
  constructor(
    private readonly _policyTypes: AdminPolicyTypeService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {}

  create(req: CreatePolicyTypeRequest): void {
    this._ui.showLoader();
    this._policyTypes
      .create(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_CREATED'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-types');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/policy-settings/policy-types');
  }
}
