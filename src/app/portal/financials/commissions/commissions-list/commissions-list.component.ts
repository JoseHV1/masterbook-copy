import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiService } from '../../../../shared/services/ui.service';
import { finalize, of, Subject, takeUntil } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { CommissionsService } from 'src/app/shared/services/commissions.service';
import { AuthService } from '@app/shared/services/auth.service';
import { AuthModel } from '@app/shared/interfaces/models/auth.model';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-commissions-list',
  templateUrl: './commissions-list.component.html',
  styleUrls: ['./commissions-list.component.scss'],
})
export class CommissionsListComponent extends FilteredTable<any> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<any[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _commissions: CommissionsService,
    private _ui: UiService,
    private _auth: AuthService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    super();
    const currentUser = this._auth.getAuth() as AuthModel;
    this.filterConfig = this._commissions.getCommissionsListFilters(
      currentUser.user.role as string
    );
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
    this._commissions
      .getCommissions(page, hits, this.filterText)
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
