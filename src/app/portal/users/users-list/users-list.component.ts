import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, of, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quote-requests-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent extends FilteredTable<PopulatedBrokerModel> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedBrokerModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _users: UserService,
    private _ui: UiService,
    private _auth: AuthService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    super();
    this.filterConfig = this._users.getUsersListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngOnInit(): void {
    if (this._auth.getAuth()?.user.role === RolesEnum.ADMIN) {
      this._loadTenants();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._users
      .getUsers(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
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
}
