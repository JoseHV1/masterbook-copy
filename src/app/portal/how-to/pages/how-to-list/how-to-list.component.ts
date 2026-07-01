import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, of, Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';

@Component({
  selector: 'app-how-to-list',
  templateUrl: './how-to-list.component.html',
  styleUrls: ['./how-to-list.component.scss'],
})
export class HowToListComponent extends FilteredTable<HowToModel> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;
  private _destroy$ = new Subject<void>();

  data: PaginatedResponse<HowToModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _howTo: HowToService,
    private _ui: UiService,
    public _url: UrlService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    super();
    this.filterConfig = this._howTo.getHowToFilters();
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
      .subscribe(resp => {
        const options = resp.records.map(t => ({ name: `${t.name} (${t.code})`, code: t._id }));
        this.filterConfig = {
          ...this.filterConfig,
          filters: [
            ...this.filterConfig.filters,
            {
              label: this._t.instant('PORTAL.TENANTS.TITLE'),
              name: 'tenant_id',
              type: FilterTypeEnum.SELECT,
              options: of(options),
            },
          ],
        };
      });
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._howTo
      .getHowToList(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => { this.data = resp; });
  }

  refresh(): void {
    this._fetchData(this.data.page, this.data.limit);
  }
}
