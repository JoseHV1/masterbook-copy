import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminInsurersService } from 'src/app/shared/services/admin-insurers.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { InsuranceCompanyStatus } from 'src/app/shared/enums/insurance-company-status.enum';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-insurer-detail',
  templateUrl: './insurer-detail.component.html',
  styleUrls: ['./insurer-detail.component.scss'],
})
export class InsurerDetailComponent {
  insurer!: InsurerModel;
  InsuranceCompanyStatus = InsuranceCompanyStatus;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _insurers: AdminInsurersService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _t: TranslateService,
    private readonly _dialog: MatDialog,
  ) {
    this._loadInsurer();
  }

  private _loadInsurer(): void {
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

  goToEdit(): void {
    this._router.navigateByUrl(`portal-admin/insurers/${this.insurer.serial}/edit`);
  }

  goBack(): void {
    this._location.back();
  }

  confirmEnable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_ENABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeEnable();
      });
  }

  private _executeEnable(): void {
    this._ui.showLoader();
    this._insurers
      .enable(this.insurer._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.insurer = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_ENABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_ENABLE')),
      });
  }

  confirmDisable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_DISABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDisable();
      });
  }

  private _executeDisable(): void {
    this._ui.showLoader();
    this._insurers
      .disable(this.insurer._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.insurer = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_DISABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_DISABLE')),
      });
  }

  confirmDelete(): void {
    if (!this.insurer.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((confirmed: boolean) => {
          if (confirmed) this._executeDelete();
        });
      return;
    }

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.INSURERS.DELETE_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.INSURERS.BTN_DELETE',
      tenants: this.insurer.tenants,
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
    this._insurers
      .removeFromTenants(this.insurer._id, tenantIds)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/insurers/list');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_DELETE')),
      });
  }

  private _executeDelete(): void {
    this._ui.showLoader();
    this._insurers
      .delete(this.insurer._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/insurers/list');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_DELETE')),
      });
  }

  openTenantStatusModal(): void {
    if (!this.insurer.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.INSURERS.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.INSURERS.BTN_UPDATE_STATUS',
      tenants: this.insurer.tenants,
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
    this._insurers
      .updateTenantStatus(this.insurer._id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_TENANT_STATUS'));
          this._loadInsurer();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_TENANT_STATUS')),
      });
  }
}
