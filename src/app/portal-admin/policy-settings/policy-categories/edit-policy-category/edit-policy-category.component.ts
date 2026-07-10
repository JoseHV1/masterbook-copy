import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminPolicyCategoryService } from 'src/app/shared/services/admin-policy-category.service';
import { UiService } from 'src/app/shared/services/ui.service';
import {
  PolicyCategoryModel,
  UpdatePolicyCategoryRequest,
} from 'src/app/shared/interfaces/models/policy-category.model';

@Component({
  selector: 'app-edit-policy-category',
  templateUrl: './edit-policy-category.component.html',
  styleUrls: ['./edit-policy-category.component.scss'],
})
export class EditPolicyCategoryComponent {
  category!: PolicyCategoryModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _categories: AdminPolicyCategoryService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._categories.getBySerial(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: category => (this.category = category),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-categories');
        },
      });
  }

  save(req: UpdatePolicyCategoryRequest): void {
    this._ui.showLoader();
    this._categories
      .update(this.category._id, req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_UPDATED'));
          this._router.navigateByUrl(`portal-admin/policy-settings/policy-categories/${this.category.serial}`);
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_UPDATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl(`portal-admin/policy-settings/policy-categories/${this.category.serial}`);
  }
}
