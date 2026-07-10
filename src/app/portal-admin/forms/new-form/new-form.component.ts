import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FormService } from 'src/app/shared/services/form.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-new-admin-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
})
export class NewAdminFormComponent {
  constructor(
    private readonly _forms: FormService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {}

  create(payload: any): void {
    this._ui.showLoader();
    this._forms
      .newForm(payload)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_CREATED'));
          this._router.navigateByUrl('portal-admin/request-forms');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/request-forms');
  }
}
