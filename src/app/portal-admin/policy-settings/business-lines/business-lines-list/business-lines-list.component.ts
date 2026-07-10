import { Component } from '@angular/core';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { AdminBusinessLineService } from 'src/app/shared/services/admin-business-line.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-business-lines-list',
  templateUrl: './business-lines-list.component.html',
  styleUrls: ['./business-lines-list.component.scss'],
})
export class BusinessLinesListComponent extends FilteredTable<BusinessLineModel> {
  filterConfig: FilterWrapperModel;

  data: PaginatedResponse<BusinessLineModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  displayedColumns = ['name', 'created_at'];

  constructor(
    private readonly _businessLines: AdminBusinessLineService,
    private readonly _ui: UiService,
  ) {
    super();
    this.filterConfig = this._businessLines.getFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._businessLines
      .getAll(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
