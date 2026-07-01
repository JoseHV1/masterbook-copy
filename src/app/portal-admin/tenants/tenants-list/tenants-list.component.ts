import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrls: ['./tenants-list.component.scss'],
})
export class TenantsListComponent extends FilteredTable<TenantModel> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<TenantModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  constructor(
    private readonly _tenants: TenantsService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
  ) {
    super();
    this.filterConfig = this._tenants.getTenantFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._tenants
      .getAll(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page, this.data.limit);
  }

  goToNew(): void {
    this._router.navigateByUrl('portal-admin/tenants/new');
  }

  confirmEnable(tenant: TenantModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_ENABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeEnable(tenant.serial);
      });
  }

  private _executeEnable(serial: string): void {
    this._ui.showLoader();
    this._tenants
      .enable(serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_ENABLED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_ENABLE')),
      });
  }

  confirmDisable(tenant: TenantModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DISABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDisable(tenant.serial);
      });
  }

  private _executeDisable(serial: string): void {
    this._ui.showLoader();
    this._tenants
      .disable(serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DISABLED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DISABLE')),
      });
  }

  confirmHardDelete(tenant: TenantModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.TENANTS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeHardDelete(tenant.serial);
      });
  }

  private _executeHardDelete(serial: string): void {
    this._ui.showLoader();
    this._tenants
      .hardDelete(serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.TENANTS.SUCCESS_DELETED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.TENANTS.ERROR_DELETE')),
      });
  }
}
