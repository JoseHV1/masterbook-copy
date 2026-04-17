import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { LeadModel } from 'src/app/portal/leads/interfaces/lead.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-account-leads',
  templateUrl: './account-leads.component.html',
  styleUrls: ['./account-leads.component.scss'],
})
export class AccountLeadsComponent extends FilteredTable<LeadModel> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<LeadModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  constructor(private _ui: UiService, private _leads: LeadsService, private _router: Router) {
    super();
    this.filterConfig = this._leads.getLeadListFilters();
    this._fetchData(this.data.page, this.data.limit);
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
}
