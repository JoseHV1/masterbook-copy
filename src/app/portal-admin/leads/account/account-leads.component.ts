import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, of, Subject, takeUntil } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { LeadModel } from 'src/app/portal/leads/interfaces/lead.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-leads',
  templateUrl: './account-leads.component.html',
  styleUrls: ['./account-leads.component.scss'],
})
export class AccountLeadsComponent extends FilteredTable<LeadModel> implements OnInit, OnDestroy {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<LeadModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _ui: UiService,
    private _leads: LeadsService,
    private _router: Router,
    private _tenants: TenantsService,
    private _t: TranslateService,
  ) {
    super();
    this.filterConfig = this._leads.getLeadListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngOnInit(): void {
    this._loadTenants();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._leads
      .getLeads(page, hits, `&type=ACCOUNT${this.filterText}`)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  onTransferLead(lead: LeadModel): void {
    this._router.navigate(['portal-admin', 'leads', 'account', lead.serial, 'transfer']);
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
}
