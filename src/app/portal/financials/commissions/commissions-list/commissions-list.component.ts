import { Component } from '@angular/core';
import { UiService } from '../../../../shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { CommissionsService } from 'src/app/shared/services/commissions.service';
import { AuthService } from '@app/shared/services/auth.service';
import { AuthModel } from '@app/shared/interfaces/models/auth.model';

@Component({
  selector: 'app-commissions-list',
  templateUrl: './commissions-list.component.html',
  styleUrls: ['./commissions-list.component.scss'],
})
export class CommissionsListComponent extends FilteredTable<any> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<any[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _commissions: CommissionsService,
    private _ui: UiService,
    private _auth: AuthService
  ) {
    super();
    const currentUser = this._auth.getAuth() as AuthModel;
    this.filterConfig = this._commissions.getCommissionsListFilters(
      currentUser.user.role as string
    );
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._commissions
      .getCommissions(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
