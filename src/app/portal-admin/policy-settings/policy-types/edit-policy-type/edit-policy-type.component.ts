import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminPolicyTypeService } from 'src/app/shared/services/admin-policy-type.service';
import { UiService } from 'src/app/shared/services/ui.service';
import {
  PolicyTypeModel,
  UpdatePolicyTypeRequest,
} from 'src/app/shared/interfaces/models/policy-type.model';

@Component({
  selector: 'app-edit-policy-type',
  templateUrl: './edit-policy-type.component.html',
  styleUrls: ['./edit-policy-type.component.scss'],
})
export class EditPolicyTypeComponent {
  policyType!: PolicyTypeModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _policyTypes: AdminPolicyTypeService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._policyTypes.getBySerial(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: policyType => (this.policyType = policyType),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-types');
        },
      });
  }

  save(req: UpdatePolicyTypeRequest): void {
    this._ui.showLoader();
    this._policyTypes
      .update(this.policyType._id, req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_UPDATED'));
          this._router.navigateByUrl(`portal-admin/policy-settings/policy-types/${this.policyType.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_UPDATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl(`portal-admin/policy-settings/policy-types/${this.policyType.serial}`);
  }
}
