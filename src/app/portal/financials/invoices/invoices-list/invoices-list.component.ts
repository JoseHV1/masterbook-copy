import { Component } from '@angular/core';
import { UiService } from '../../../../shared/services/ui.service';
import { finalize } from 'rxjs';

import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { PopulatedInvoiceModel } from 'src/app/shared/interfaces/models/invoice.model';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss'],
})
export class InvoicesListComponent extends FilteredTable<PopulatedInvoiceModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedInvoiceModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _invoices: InvoiceService, private _ui: UiService) {
    super();
    this.filterConfig = this._invoices.getInvoicesListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._invoices
      .getInvoices(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
