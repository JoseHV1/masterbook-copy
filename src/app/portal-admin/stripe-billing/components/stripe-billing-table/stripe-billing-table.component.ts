import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StripeBillingModel } from 'src/app/shared/interfaces/models/stripe-billing.model';
import { StripeBillingStatusEnum } from 'src/app/shared/enums/stripe-billing-status.enum';
import { FilterActive } from 'src/app/shared/models/filters.model';

@Component({
  selector: 'app-stripe-billing-table',
  templateUrl: './stripe-billing-table.component.html',
  styleUrls: ['./stripe-billing-table.component.scss'],
})
export class StripeBillingTableComponent {
  @Input() data: StripeBillingModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() goToDetail = new EventEmitter<string>();

  readonly displayedColumns = [
    'serial',
    'agency',
    'tenant',
    'status',
    'event_type',
    'amount',
    'paid_at',
  ];

  readonly StripeBillingStatusEnum = StripeBillingStatusEnum;

  formatAmount(amount: number, currency: string): string {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}
