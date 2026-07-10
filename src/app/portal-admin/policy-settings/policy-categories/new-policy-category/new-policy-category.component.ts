import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminPolicyCategoryService } from 'src/app/shared/services/admin-policy-category.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreatePolicyCategoryRequest } from 'src/app/shared/interfaces/models/policy-category.model';

@Component({
  selector: 'app-new-policy-category',
  templateUrl: './new-policy-category.component.html',
  styleUrls: ['./new-policy-category.component.scss'],
})
export class NewPolicyCategoryComponent {
  constructor(
    private readonly _categories: AdminPolicyCategoryService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {}

  create(req: CreatePolicyCategoryRequest): void {
    this._ui.showLoader();
    this._categories
      .create(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_CREATED'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-categories');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/policy-settings/policy-categories');
  }
}
