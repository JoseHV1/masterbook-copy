import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FormStatusEnum } from 'src/app/shared/enums/form-status.enum';
import { PopulatedFormModel } from 'src/app/shared/interfaces/models/form.model';
import { FormService } from 'src/app/shared/services/form.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UploadFileService } from 'src/app/shared/services/upload_file.service';
import { CreateFormModalComponent } from 'src/app/portal/forms/components/create-form-modal/create-form-modal.component';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-admin-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss'],
})
export class AdminFormDetailComponent {
  form!: PopulatedFormModel;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _forms: FormService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _t: TranslateService,
    private readonly _dialog: MatDialog,
    private readonly _uploadFile: UploadFileService
  ) {
    this._loadForm();
  }

  private _loadForm(): void {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._forms.getForm(params['id'])),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: form => (this.form = form as PopulatedFormModel),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/request-forms');
        },
      });
  }

  goBack(): void {
    this._location.back();
  }

  openEditModal(): void {
    this._dialog
      .open(CreateFormModalComponent, {
        autoFocus: false,
        data: { form: this.form, isAdmin: true },
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) this._loadForm();
      });
  }

  openDocument(): void {
    const url = this.form?.form_document?.document;
    if (!url) return;

    this._uploadFile.getUrlFile(url).subscribe({
      next: res => {
        if (res) window.open(res, '_blank');
      },
    });
  }

  confirmToggleStatus(): void {
    const isActive = this.form.status === FormStatusEnum.ACTIVE;
    this._ui
      .showConfirmationModal({
        text: this._t.instant(
          isActive
            ? 'PORTAL.PORTAL_ADMIN.FORMS.CONFIRM_DISABLE'
            : 'PORTAL.PORTAL_ADMIN.FORMS.CONFIRM_ENABLE'
        ),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeToggleStatus();
      });
  }

  private _executeToggleStatus(): void {
    this._ui.showLoader();
    this._forms
      .toggleStatus(this.form._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.form = { ...this.form, status: updated.status };
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_STATUS'));
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_STATUS')),
      });
  }

  confirmDelete(): void {
    if (!this.form.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((confirmed: boolean) => {
          if (confirmed) this._executeDelete();
        });
      return;
    }

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.FORMS.DELETE_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.FORMS.BTN_DELETE',
      tenants: this.form.tenants,
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
    this._forms
      .removeFromTenants(this.form._id, tenantIds)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/request-forms');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_DELETE')),
      });
  }

  private _executeDelete(): void {
    this._ui.showLoader();
    this._forms
      .deleteForm(this.form._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/request-forms');
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_DELETE')),
      });
  }

  openTenantStatusModal(): void {
    if (!this.form.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.FORMS.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.FORMS.BTN_UPDATE_STATUS',
      tenants: this.form.tenants,
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
    this._forms
      .updateTenantStatus(this.form._id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_TENANT_STATUS'));
          this._loadForm();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_TENANT_STATUS')),
      });
  }

  getInsurerNames(): string {
    return (this.form?.insurers || []).map(i => i.name).join(', ') || '—';
  }

  getTenantNames(): string {
    if (!this.form?.tenants?.length)
      return this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ALL_TENANTS');
    return this.form.tenants
      .map(t => {
        const inactiveSuffix =
          t.status === 'INACTIVE'
            ? ` (${this._t.instant('SHARED.TENANT_SCOPE_MODAL.STATUS_INACTIVE')})`
            : '';
        return `${t.name} (${t.code})${inactiveSuffix}`;
      })
      .join(', ');
  }
}
