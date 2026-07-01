import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { AdminPanelService } from '@app/shared/services/admin-panel.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent extends FilteredTable<any> implements OnDestroy {
  filterConfig!: FilterWrapperModel;
  private _destroy$ = new Subject<void>();

  data: PaginatedResponse<any[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  constructor(
    private _ui: UiService,
    private _adminPanel: AdminPanelService,
    private _tenants: TenantsService,
  ) {
    super();
    this.filterConfig = this._adminPanel.getAdminListFilters();
    this._loadTenantsAndInit();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _loadTenantsAndInit(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: resp => {
          this.filterConfig = this._adminPanel.getAdminListFilters(resp.records);
          this._fetchData(this.data.page, this.data.limit);
        },
        error: () => {
          this.filterConfig = this._adminPanel.getAdminListFilters();
          this._fetchData(this.data.page, this.data.limit);
        },
      });
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._adminPanel
      .getClients(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
