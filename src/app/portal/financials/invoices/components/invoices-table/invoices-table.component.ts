import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, take } from 'rxjs';
import { Location } from '@angular/common';
import { PopulatedInvoiceModel } from 'src/app/shared/interfaces/models/invoice.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-invoices-table',
  templateUrl: './invoices-table.component.html',
  styleUrls: ['./invoices-table.component.scss'],
})
export class InvoicesTableComponent implements OnInit {
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  @Input() data?: PopulatedInvoiceModel[];
  @Input() filtersActive: FilterActive[] = [];
  displayedColumns: string[] = [
    'serial',
    'policy_number',
    'invoice_date',
    'amount',
    'balance',
    'invoice_to',
    'category',
    'aging_days',
    'status',
    'actions',
  ];

  expanded: any | null = null;
  loadingRowId: string | null = null;
  urlDetails?: string;
  private errorRowIds = new Set<string>();

  constructor(
    private _invoices: InvoiceService,
    private _ui: UiService,
    public _url: UrlService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    const path = this._location.path();

    if (!this.urlDetails) {
      this.urlDetails = path.includes('/portal-client')
        ? '/portal-client/invoices'
        : '/portal/invoices';
    }
  }

  toggleRow(row: any) {
    const opening = this.expanded !== row;
    this.expanded = opening ? row : null;

    if (opening) {
      const id = row?._id;
      if (id && !Array.isArray(row.payments) && this.loadingRowId !== id) {
        this.fetchPayments(row);
      }
    }
  }

  retryLoad(element: any, $event?: MouseEvent) {
    $event?.stopPropagation();
    this.fetchPayments(element, true);
  }

  private fetchPayments(element: any, isRetry = false) {
    const id = element?._id;
    if (!id) return;

    this.loadingRowId = id;
    if (isRetry) this.errorRowIds.delete(id);

    this._invoices
      .getPaymentsByInvoiceId(id)
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

  getPaymentsTotal(
    pays: Array<{ payment_applied?: number }> | null | undefined
  ): number {
    if (!Array.isArray(pays)) return 0;
    return pays.reduce((sum, p) => sum + (p?.payment_applied ?? 0), 0);
  }

  hasErrorForRow(id: string): boolean {
    return this.errorRowIds.has(id);
  }
  getStatusClass(status: string | null): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      default:
        return 'status-inactive';
    }
  }

  getInvoiceAging(inv: any): number | null {
    if (!inv?.createdAt) return null;

    if (inv.status === 'PAID') return null;

    const invoice = new Date(inv.createdAt);
    const today = new Date();

    invoice.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    let days = Math.floor(
      (today.getTime() - invoice.getTime()) / (1000 * 60 * 60 * 24)
    );

    return days < 0 ? 0 : days;
  }

  openDownload(url: string) {
    window.open(url, '_blank');
  }
}
