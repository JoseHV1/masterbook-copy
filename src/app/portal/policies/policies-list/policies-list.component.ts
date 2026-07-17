import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize, of, Subject, takeUntil } from 'rxjs';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { AuthModel } from '@app/shared/interfaces/models/auth.model';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.scss'],
})
export class PoliciesListComponent extends FilteredTable<PopulatedPolicyModel> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<PopulatedPolicyModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _policies: PoliciesService,
    private _ui: UiService,
    public url: UrlService,
    private route: ActivatedRoute,
    private _auth: AuthService,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    super();

    const filterParam = this.route.snapshot.queryParamMap.get('filter');
    if (filterParam) {
      this.filterText = '&policies=nearing_expired';
    }

    const currentUser = this._auth.getAuth() as AuthModel;
    this.filterConfig = this._policies.getPolicyListFilters(
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

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._policies
      .getPolicies(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: resp => { this.data = resp; },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.POLICIES.LOAD_ERROR')),
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
