import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { LeadModel } from '../interfaces/lead.model';
import { LeadsService } from '../services/leads.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: ['./leads-list.component.scss'],
})
export class LeadsListComponent extends FilteredTable<LeadModel> {
  filterConfig: FilterWrapperModel;

  data: PaginatedResponse<LeadModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _leads: LeadsService,
    private _ui: UiService,
    private _t: TranslateService,
  ) {
    super();
    this.filterConfig = this._leads.getLeadListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._leads
      .getLeads(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: resp => (this.data = resp),
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.LEADS.LOAD_ERROR')),
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
