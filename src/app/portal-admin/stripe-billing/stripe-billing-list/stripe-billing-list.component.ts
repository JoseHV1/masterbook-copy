import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { StripeBillingModel } from 'src/app/shared/interfaces/models/stripe-billing.model';
import { StripeBillingService } from 'src/app/shared/services/stripe-billing.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-stripe-billing-list',
  templateUrl: './stripe-billing-list.component.html',
  styleUrls: ['./stripe-billing-list.component.scss'],
})
export class StripeBillingListComponent extends FilteredTable<StripeBillingModel> {
  filterConfig!: FilterWrapperModel;

  data: PaginatedResponse<StripeBillingModel[]> = {
    records: [],
    total_records: 0,
    page: 0,
    limit: 10,
  };

  constructor(
    private readonly _billing: StripeBillingService,
    private readonly _ui: UiService,
    private readonly _router: Router,
  ) {
    super();
    this.filterConfig = this._billing.getFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._billing
      .getAll(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => (this.data = resp));
  }

  refresh(): void {
    this._fetchData(this.data.page, this.data.limit);
  }

  goToDetail(serial: string): void {
    this._router.navigateByUrl(`portal-admin/stripe-billing/${serial}`);
  }
}
