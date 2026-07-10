import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminPolicyCategoryService } from 'src/app/shared/services/admin-policy-category.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PolicyCategoryModel } from 'src/app/shared/interfaces/models/policy-category.model';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-policy-category-detail',
  templateUrl: './policy-category-detail.component.html',
  styleUrls: ['./policy-category-detail.component.scss'],
})
export class PolicyCategoryDetailComponent {
  category!: PolicyCategoryModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _categories: AdminPolicyCategoryService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _t: TranslateService,
    private readonly _dialog: MatDialog,
  ) {
    this._loadCategory();
  }

  private _loadCategory(): void {
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

  goToEdit(): void {
    this._router.navigateByUrl(`portal-admin/policy-settings/policy-categories/${this.category.serial}/edit`);
  }

  goBack(): void {
    this._location.back();
  }

  confirmDelete(): void {
    if (!this.category.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((confirmed: boolean) => {
          if (confirmed) this._executeDelete();
        });
      return;
    }

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.DELETE_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.BTN_DELETE',
      tenants: this.category.tenants,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result) this._executeTenantDelete(result.tenantIds);
      });
  }

  private _executeTenantDelete(tenantIds: string[]): void {
    this._ui.showLoader();
    this._categories
      .removeFromTenants(this.category._id, tenantIds)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-categories');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  private _executeDelete(): void {
    this._ui.showLoader();
    this._categories
      .delete(this.category._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/policy-settings/policy-categories');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  openTenantStatusModal(): void {
    if (!this.category.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.BTN_UPDATE_STATUS',
      tenants: this.category.tenants,
      statusToggle: true,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result?.status) this._executeTenantStatusUpdate(result.tenantIds, result.status);
      });
  }

  private _executeTenantStatusUpdate(tenantIds: string[], status: 'ACTIVE' | 'INACTIVE'): void {
    this._ui.showLoader();
    this._categories
      .updateTenantStatus(this.category._id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_TENANT_STATUS'));
          this._loadCategory();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_TENANT_STATUS')),
      });
  }

  getBusinessLineNames(): string {
    return (this.category?.business_lines || []).map(l => l.name).join(', ') || '—';
  }
}
