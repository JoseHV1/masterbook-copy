import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminBusinessLineService } from 'src/app/shared/services/admin-business-line.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-business-line-detail',
  templateUrl: './business-line-detail.component.html',
  styleUrls: ['./business-line-detail.component.scss'],
})
export class BusinessLineDetailComponent {
  businessLine!: BusinessLineModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _businessLines: AdminBusinessLineService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
    private readonly _dialog: MatDialog,
  ) {
    this._loadBusinessLine();
  }

  private _loadBusinessLine(): void {
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

  goToEdit(): void {
    this._router.navigateByUrl(`portal-admin/policy-settings/business-lines/${this.businessLine.serial}/edit`);
  }

  goBack(): void {
    this._router.navigateByUrl('portal-admin/policy-settings/business-lines/list');
  }

  confirmDelete(): void {
    if (!this.businessLine.tenants?.length) {
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
      tenants: this.businessLine.tenants,
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
    this._businessLines
      .removeFromTenants(this.businessLine._id, tenantIds)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/policy-settings/business-lines');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  private _executeDelete(): void {
    this._ui.showLoader();
    this._businessLines
      .delete(this.businessLine._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/policy-settings/business-lines');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  openTenantStatusModal(): void {
    if (!this.businessLine.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.BTN_UPDATE_STATUS',
      tenants: this.businessLine.tenants,
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
    this._businessLines
      .updateTenantStatus(this.businessLine._id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_TENANT_STATUS'));
          this._loadBusinessLine();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_TENANT_STATUS')),
      });
  }
}
