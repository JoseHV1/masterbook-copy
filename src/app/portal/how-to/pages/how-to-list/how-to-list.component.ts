import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';

@Component({
  selector: 'app-how-to-list',
  templateUrl: './how-to-list.component.html',
  styleUrls: ['./how-to-list.component.scss'],
})
export class HowToListComponent extends FilteredTable<HowToModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<HowToModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _howTo: HowToService,
    private _ui: UiService,
    public _url: UrlService
  ) {
    super();
    this.filterConfig = this._howTo.getHowToFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._howTo
      .getHowToList(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
