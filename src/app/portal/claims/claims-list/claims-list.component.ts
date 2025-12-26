import { Component } from '@angular/core';
import { UiService } from '../../../shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { ClaimModel } from 'src/app/shared/models/claim.model';
import { ClaimsService } from 'src/app/shared/services/claims.service';
import { PopulatedClaimModel } from 'src/app/shared/interfaces/models/claims.model';

@Component({
  selector: 'app-claims-list',
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.scss'],
})
export class ClaimsListComponent extends FilteredTable<PopulatedClaimModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedClaimModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _ui: UiService, private _claims: ClaimsService) {
    super();
    this.filterConfig = this._claims.getClaimsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._claims
      .getClaims(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
