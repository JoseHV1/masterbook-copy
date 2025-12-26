import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { PaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { finalize, take } from 'rxjs';
import { PaymentsService } from 'src/app/shared/services/payments.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss'],
})
export class PaymentsTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  @Input() data?: PaymentTransactionModel[];
  @Input() filtersActive: FilterActive[] = [];
  displayedColumns: string[] = [
    'serial',
    'ach_number',
    'payment_from',
    'payment_for',
    'payment_date',
    'total_amount',
    'subtotal',
    'taxes',
    'retentions',
    'balance',
    'status',
  ];

  expanded: any | null = null;
  loadingRowId: string | null = null;
  private errorRowIds = new Set<string>();

  constructor(
    public _url: UrlService,
    private _ui: UiService,
    private _payment: PaymentsService
  ) {}

  toggleRow(row: any) {
    const opening = this.expanded !== row;
    this.expanded = opening ? row : null;

    if (opening) {
      const id = row?._id;
      if (id && !Array.isArray(row.payments) && this.loadingRowId !== id) {
        this.fetchPaymentsAplications(row);
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'full_paid':
        return 'text-success';
      case 'partially_paid':
        return 'text-warning';
      case 'unpaid':
        return 'text-danger';
      case 'available':
        return 'text-info';
      default:
        return '';
    }
  }

  private fetchPaymentsAplications(element: any, isRetry = false) {
    const id = element?._id;
    if (!id) return;

    this.loadingRowId = id;
    if (isRetry) this.errorRowIds.delete(id);

    this._payment
      .getAllPayments(id)
      .pipe(
        take(1),
        finalize(() => (this.loadingRowId = null))
      )
      .subscribe({
        next: payments => {
          element.payments = payments ?? [];
        },
        error: err => {
          this.errorRowIds.add(id);
          this._ui.showAlertError('Failed to load payments. Try again.');
        },
      });
  }
}
