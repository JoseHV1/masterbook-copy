import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, of, Subject, take, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { AdminInsurersService } from 'src/app/shared/services/admin-insurers.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';

@Component({
  selector: 'app-insurers-list',
  templateUrl: './insurers-list.component.html',
  styleUrls: ['./insurers-list.component.scss'],
})
export class InsurersListComponent extends FilteredTable<InsurerModel> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<InsurerModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private readonly _insurers: AdminInsurersService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
    private readonly _tenants: TenantsService,
  ) {
    super();
    this.filterConfig = this._insurers.getAdminFilters();
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
        error: () => {
          // El listado funciona sin el filtro de tenant si falla la carga
        },
      });
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._insurers
      .getAll(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page, this.data.limit);
  }

  goToNew(): void {
    this._router.navigateByUrl('portal-admin/insurers/new');
  }

  confirmEnable(insurer: InsurerModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_ENABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeEnable(insurer._id);
      });
  }

  private _executeEnable(id: string): void {
    this._ui.showLoader();
    this._insurers
      .enable(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_ENABLED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_ENABLE')),
      });
  }

  confirmDisable(insurer: InsurerModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_DISABLE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDisable(insurer._id);
      });
  }

  private _executeDisable(id: string): void {
    this._ui.showLoader();
    this._insurers
      .disable(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_DISABLED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_DISABLE')),
      });
  }

  confirmDelete(insurer: InsurerModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDelete(insurer._id);
      });
  }

  private _executeDelete(id: string): void {
    this._ui.showLoader();
    this._insurers
      .delete(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_DELETED'));
          this.refresh();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_DELETE')),
      });
  }
}
