import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, of, Subject, take, takeUntil } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { AdminBusinessLineService } from 'src/app/shared/services/admin-business-line.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-business-lines-list',
  templateUrl: './business-lines-list.component.html',
  styleUrls: ['./business-lines-list.component.scss'],
})
export class BusinessLinesListComponent
  extends FilteredTable<BusinessLineModel>
  implements OnInit, OnDestroy
{
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<BusinessLineModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private readonly _businessLines: AdminBusinessLineService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
    private readonly _tenants: TenantsService,
    private readonly _dialog: MatDialog,
  ) {
    super();
    this.filterConfig = this._businessLines.getAdminFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngOnInit(): void {
    this._loadTenants();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _loadTenants(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: resp => {
          const options = resp.records.map(t => ({ name: `${t.name} (${t.code})`, code: t._id }));
          this.filterConfig = {
            ...this.filterConfig,
            filters: [
              ...this.filterConfig.filters.filter(f => f.name !== 'tenant_id'),
              {
                label: this._t.instant('PORTAL.TENANTS.TITLE'),
                name: 'tenant_id',
                type: FilterTypeEnum.SELECT,
                options: of(options),
              },
            ],
          };
        },
      });
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._businessLines
      .getAll(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  goToNew(): void {
    this._router.navigateByUrl('portal-admin/policy-settings/business-lines/new');
  }

  confirmDelete(businessLine: BusinessLineModel): void {
    if (!businessLine.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((confirmed: boolean) => {
          if (confirmed) this._executeDelete(businessLine._id);
        });
      return;
    }

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.DELETE_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.BTN_DELETE',
      tenants: businessLine.tenants,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result) this._executeTenantDelete(businessLine._id, result.tenantIds);
      });
  }

  private _executeTenantDelete(id: string, tenantIds: string[]): void {
    this._ui.showLoader();
    this._businessLines
      .removeFromTenants(id, tenantIds)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this.refresh();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  private _executeDelete(id: string): void {
    this._ui.showLoader();
    this._businessLines
      .delete(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_DELETED'));
          this.refresh();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_DELETE')),
      });
  }

  openTenantStatusModal(businessLine: BusinessLineModel): void {
    if (!businessLine.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.BTN_UPDATE_STATUS',
      tenants: businessLine.tenants,
      statusToggle: true,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result?.status) this._executeTenantStatusUpdate(businessLine._id, result.tenantIds, result.status);
      });
  }

  private _executeTenantStatusUpdate(
    id: string,
    tenantIds: string[],
    status: 'ACTIVE' | 'INACTIVE',
  ): void {
    this._ui.showLoader();
    this._businessLines
      .updateTenantStatus(id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.SUCCESS_TENANT_STATUS'));
          this.refresh();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.POLICY_SETTINGS.ERROR_TENANT_STATUS')),
      });
  }
}
