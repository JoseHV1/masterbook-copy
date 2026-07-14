import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminBusinessLineService } from 'src/app/shared/services/admin-business-line.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreateBusinessLineRequest } from 'src/app/shared/interfaces/models/business-line.model';

@Component({
  selector: 'app-new-business-line',
  templateUrl: './new-business-line.component.html',
  styleUrls: ['./new-business-line.component.scss'],
})
export class NewBusinessLineComponent {
  constructor(
    private readonly _businessLines: AdminBusinessLineService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {}

  create(req: CreateBusinessLineRequest): void {
    this._ui.showLoader();
    this._businessLines
      .create(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_CREATED'));
          this._router.navigateByUrl('portal-admin/policy-settings/business-lines');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/policy-settings/business-lines');
  }
}
