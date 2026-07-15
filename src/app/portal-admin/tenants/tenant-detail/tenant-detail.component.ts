import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TenantAdminModel } from 'src/app/shared/interfaces/models/tenant-admin.model';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss'],
})
export class TenantDetailComponent {
  tenant!: TenantModel;
  TenantStatusEnum = TenantStatusEnum;

  admins: TenantAdminModel[] = [];
  adminsLoading = false;
  showAdminForm = false;
  adminSaving = false;
  adminForm!: FormGroup;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _tenants: TenantsService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _location: Location,
    private readonly _t: TranslateService,
    private readonly _fb: FormBuilder,
  ) {
    this._buildAdminForm();
    this._loadTenant();
  }

  private _buildAdminForm(): void {
    this.adminForm = this._fb.group({
      first_name: [null, [Validators.required]],
      last_name:  [null, [Validators.required]],
      email:      [null, [Validators.required, Validators.email]],
    });
  }

  private _loadTenant(): void {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => this._tenants.getOne(params['serial'])),
        finalize(() => this._ui.hideLoader()),
      )
      .subscribe({
        next: tenant => {
          this.tenant = tenant;
          this._loadAdmins();
        },
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/tenants/list');
        },
      });
  }

  private _loadAdmins(): void {
    this.adminsLoading = true;
    this._tenants.getAdmins(this.tenant.serial)
      .pipe(finalize(() => (this.adminsLoading = false)))
      .subscribe({ next: admins => (this.admins = admins) });
  }

  toggleAdminForm(): void {
    this.showAdminForm = !this.showAdminForm;
    if (!this.showAdminForm) this.adminForm.reset();
  }

  submitAdmin(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    this.adminSaving = true;
    this._tenants.createAdmin(this.tenant.serial, this.adminForm.getRawValue())
      .pipe(finalize(() => (this.adminSaving = false)))
      .subscribe({
        next: admin => {
          this.admins.push(admin);
          this.showAdminForm = false;
          this.adminForm.reset();
          this._ui.showAlertSuccess('Admin creado. Se envió un correo con las credenciales.');
        },
        error: () => this._ui.showAlertError('Error al crear el administrador. El correo puede estar en uso.'),
      });
  }

  goToEdit(): void {
    this._router.navigateByUrl(`portal-admin/tenants/${this.tenant.serial}/edit`);
  }

  goBack(): void {
    this._location.back();
  }

  confirmEnable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_ENABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeEnable();
      });
  }

  private _executeEnable(): void {
    this._ui.showLoader();
    this._tenants
      .enable(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.tenant = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_ENABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_ENABLE')),
      });
  }

  confirmDisable(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DISABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDisable();
      });
  }

  private _executeDisable(): void {
    this._ui.showLoader();
    this._tenants
      .disable(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: updated => {
          this.tenant = updated;
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DISABLED'));
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DISABLE')),
      });
  }

  confirmHardDelete(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeHardDelete();
      });
  }

  private _executeHardDelete(): void {
    this._ui.showLoader();
    this._tenants
      .hardDelete(this.tenant.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DELETED'));
          this._router.navigateByUrl('portal-admin/tenants/list');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DELETE')),
      });
  }
}
