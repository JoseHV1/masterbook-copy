import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminInsurersService } from 'src/app/shared/services/admin-insurers.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { InsurerModel, UpdateInsurerRequest } from 'src/app/shared/interfaces/models/insurer.model';

@Component({
  selector: 'app-edit-insurer',
  templateUrl: './edit-insurer.component.html',
  styleUrls: ['./edit-insurer.component.scss'],
})
export class EditInsurerComponent {
  insurer!: InsurerModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _insurers: AdminInsurersService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._insurers.getBySerial(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: insurer => (this.insurer = insurer),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/insurers/list');
        },
      });
  }

  save(req: UpdateInsurerRequest): void {
    this._ui.showLoader();
    this._insurers
      .update(this.insurer._id, req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_UPDATED'));
          this._router.navigateByUrl(`portal-admin/insurers/${this.insurer.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_UPDATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl(`portal-admin/insurers/${this.insurer.serial}`);
  }
}
