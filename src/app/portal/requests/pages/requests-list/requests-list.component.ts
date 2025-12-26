import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
})
export class RequestsListComponent extends FilteredTable<PopulatedRequestModel> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<PopulatedRequestModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _requests: RequestsService,
    private _ui: UiService,
    public _url: UrlService
  ) {
    super();
    this.filterConfig = this._requests.getRequestsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._requests
      .getRequests(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
