import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminBusinessLineService } from 'src/app/shared/services/admin-business-line.service';
import { UiService } from 'src/app/shared/services/ui.service';
import {
  BusinessLineModel,
  UpdateBusinessLineRequest,
} from 'src/app/shared/interfaces/models/business-line.model';

@Component({
  selector: 'app-edit-business-line',
  templateUrl: './edit-business-line.component.html',
  styleUrls: ['./edit-business-line.component.scss'],
})
export class EditBusinessLineComponent {
  businessLine!: BusinessLineModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _businessLines: AdminBusinessLineService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._businessLines.getBySerial(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: businessLine => (this.businessLine = businessLine),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/policy-settings/business-lines');
        },
      });
  }

  save(req: UpdateBusinessLineRequest): void {
    this._ui.showLoader();
    this._businessLines
      .update(this.businessLine._id, req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_UPDATED'));
          this._router.navigateByUrl(`portal-admin/policy-settings/business-lines/${this.businessLine.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_UPDATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl(`portal-admin/policy-settings/business-lines/${this.businessLine.serial}`);
  }
}
