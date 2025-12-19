import { Component } from '@angular/core';
import { UiService } from '../../../../shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { PaymentsService } from 'src/app/shared/services/payments.service';

@Component({
  selector: 'app-payment-transaction-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsListComponent extends FilteredTable<PaymentTransactionModel> {
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PaymentTransactionModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(private _payments: PaymentsService, private _ui: UiService) {
    super();
    this.filterConfig = this._payments.getPaymentsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPage?: number): void {
    const hits = hitsPerPage ?? this.data.limit;
    this._ui.showLoader();
    this._payments
      .getPaymentTransactions(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }
}
