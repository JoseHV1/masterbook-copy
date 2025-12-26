import { Component } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { AdminPanelService } from '@app/shared/services/admin-panel.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent extends FilteredTable<any> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<any[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  constructor(private _ui: UiService, private _adminPanel: AdminPanelService) {
    super();
    this.filterConfig = this._adminPanel.getAdminListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    console.log('Fetching data for page', page, 'with', hits, 'hits per page');
    this._adminPanel
      .getClients(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        console.log('Data fetched:', resp);
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
