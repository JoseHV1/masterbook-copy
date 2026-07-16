import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AdminTenantContextService } from '@app/shared/services/admin-tenant-context.service';

type DashboardTotals = Partial<{
  total_sales_mtd_cents: number;
  total_sales_ytd_cents: number;

  active_agencies_last_30_days: number;
  total_active_policies: number;
  renewals_next_30_days: number;

  total_users: number;
}>;

type KpiKey =
  | 'total_sales_mtd_cents'
  | 'total_sales_ytd_cents'
  | 'active_agencies_last_30_days'
  | 'total_active_policies'
  | 'renewals_next_30_days'
  | 'total_users';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
})
export class SummaryCardsComponent implements OnChanges, OnDestroy {
  @Input() dashboardTotals: DashboardTotals | null = null;

  animatedTotals: Record<KpiKey, number> = {
    total_sales_mtd_cents: 0,
    total_sales_ytd_cents: 0,
    active_agencies_last_30_days: 0,
    total_active_policies: 0,
    renewals_next_30_days: 0,
    total_users: 0,
  };

  private subs: Subscription[] = [];

  constructor(public adminCtx: AdminTenantContextService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardTotals'] && this.dashboardTotals) {
      this.animateAllNumbers(this.dashboardTotals);
    }
  }

  ngOnDestroy(): void {
    this.clearSubs();
  }

  private clearSubs() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

  private animateAllNumbers(totals: DashboardTotals) {
    this.clearSubs();
    const keys = Object.keys(this.animatedTotals) as KpiKey[];

    keys.forEach(key => {
      const finalValue = Number(totals?.[key] ?? 0);

      if (!finalValue) {
        this.animatedTotals[key] = 0;
        return;
      }

      const durationMs = 700;
      const tickMs = 16;
      const steps = Math.max(12, Math.floor(durationMs / tickMs));

      const increment = Math.max(1, Math.ceil(finalValue / steps));
      let current = 0;

      const sub = interval(tickMs)
        .pipe(take(steps))
        .subscribe({
          next: () => {
            current = Math.min(current + increment, finalValue);
            this.animatedTotals[key] = current;
          },
          complete: () => {
            this.animatedTotals[key] = finalValue;
          },
        });

      this.subs.push(sub);
    });
  }

  // ---------- formatters ----------
  formatNumber(value: number): string {
    return new Intl.NumberFormat().format(value ?? 0);
  }

  formatMoney(value: number): string {
    const amount = value ?? 0;
    const tenant = this.adminCtx.snapshot;

    if (!tenant?.currency_symbol) {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
      }).format(amount);
    }

    const {
      currency_symbol,
      currency_symbol_position,
      currency_decimal_places = 2,
      currency_thousands_separator = ',',
      currency_decimal_separator = '.',
    } = tenant;

    const [intPart, decPart] = amount
      .toFixed(currency_decimal_places)
      .split('.');
    const intFormatted = intPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      currency_thousands_separator
    );
    const formatted =
      currency_decimal_places > 0
        ? `${intFormatted}${currency_decimal_separator}${decPart}`
        : intFormatted;

    return currency_symbol_position === 'after'
      ? `${formatted} ${currency_symbol}`
      : `${currency_symbol} ${formatted}`;
  }

  formatMoneyFromCents(cents: number): string {
    return this.formatMoney((cents ?? 0) / 100);
  }
}
