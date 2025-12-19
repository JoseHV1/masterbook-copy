import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.scss'],
})
export class PoliciesListComponent extends FilteredTable<PopulatedPolicyModel> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<PopulatedPolicyModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _policies: PoliciesService,
    private _ui: UiService,
    public url: UrlService,
    private route: ActivatedRoute
  ) {
    super();

    const filterParam = this.route.snapshot.queryParamMap.get('filter');
    if (filterParam) {
      this.filterText = '&policies=nearing_expired';
    }

    this.filterConfig = this._policies.getPolicyListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._policies
      .getPolicies(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
