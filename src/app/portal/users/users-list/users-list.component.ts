import { Component } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';

@Component({
  selector: 'app-quote-requests-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent extends FilteredTable<PopulatedBrokerModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedBrokerModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _users: UserService, private _ui: UiService) {
    super();
    this.filterConfig = this._users.getUsersListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._users
      .getUsers(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
