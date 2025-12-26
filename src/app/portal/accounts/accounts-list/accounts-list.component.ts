import { Component } from '@angular/core';
import { AccountsService } from '../../../shared/services/accounts.service';
import { UiService } from '../../../shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent extends FilteredTable<PopulatedAccount> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedAccount[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _accounts: AccountsService, private _ui: UiService) {
    super();
    this.filterConfig = this._accounts.getAccountsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPAge?: number): void {
    const hits = hitsPerPAge ?? this.data.limit;
    this._ui.showLoader();
    this._accounts
      .getAccounts(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
