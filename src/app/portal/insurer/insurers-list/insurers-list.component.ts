import { Component } from '@angular/core';
import { finalize } from 'rxjs';

import { UiService } from 'src/app/shared/services/ui.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';

@Component({
  selector: 'app-insurers-list',
  templateUrl: './insurers-list.component.html',
  styleUrls: ['./insurers-list.component.scss'],
})
export class InsurersListComponent extends FilteredTable<InsurerModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<InsurerModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _insurer: InsurerConfigService, private _ui: UiService) {
    super();
    this.filterConfig = this._insurer.getInsurerListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._insurer
      .getInsurers(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
