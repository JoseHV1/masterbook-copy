import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, of, Subject, take, takeUntil } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { PopulatedFormModel } from 'src/app/shared/interfaces/models/form.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { FormService } from 'src/app/shared/services/form.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreateFormModalComponent } from 'src/app/portal/forms/components/create-form-modal/create-form-modal.component';

@Component({
  selector: 'app-admin-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss'],
})
export class AdminFormsListComponent
  extends FilteredTable<PopulatedFormModel>
  implements OnInit, OnDestroy
{
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<PopulatedFormModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  displayedColumns = ['serial', 'name', 'policy_type', 'tenants', 'status', 'actions'];

  private _destroy$ = new Subject<void>();

  constructor(
    private readonly _forms: FormService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
    private readonly _tenants: TenantsService,
    private readonly _dialog: MatDialog
  ) {
    super();
    this.filterConfig = this._forms.getAdminFormsFilters();
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
          const options = resp.records.map(t => ({
            name: `${t.name} (${t.code})`,
            code: t._id,
          }));
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
    this._forms
      .getForms(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  openCreateModal(): void {
    this._dialog
      .open(CreateFormModalComponent, {
        autoFocus: false,
        data: { isAdmin: true },
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) this.refresh();
      });
  }

  goToDetail(form: PopulatedFormModel): void {
    this._router.navigateByUrl(`portal-admin/request-forms/${form._id}`);
  }

  confirmToggleStatus(form: PopulatedFormModel): void {
    const isActive = form.status?.toLowerCase() === 'active';
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
        if (confirmed) this._executeToggleStatus(form._id);
      });
  }

  private _executeToggleStatus(id: string): void {
    this._ui.showLoader();
    this._forms
      .toggleStatus(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_STATUS'));
          this.refresh();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_STATUS')),
      });
  }

  confirmDelete(form: PopulatedFormModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeDelete(form._id);
      });
  }

  private _executeDelete(id: string): void {
    this._ui.showLoader();
    this._forms
      .deleteForm(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.SUCCESS_DELETED'));
          this.refresh();
        },
        error: () =>
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.FORMS.ERROR_DELETE')),
      });
  }
}
