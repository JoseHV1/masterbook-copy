import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

type DashboardTotals = Partial<{
  total_commissions_mtd: number;
  total_commissions_ytd: number;

  active_agencies_last_30_days: number;
  total_active_policies: number;
  renewals_next_30_days: number;

  total_users: number;
}>;

type KpiKey =
  | 'total_commissions_mtd'
  | 'total_commissions_ytd'
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
    total_commissions_mtd: 0,
    total_commissions_ytd: 0,
    active_agencies_last_30_days: 0,
    total_active_policies: 0,
    renewals_next_30_days: 0,
    total_users: 0,
  };

  private subs: Subscription[] = [];

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

      const increment = Math.max(1, Math.floor(finalValue / steps));
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

  formatMoney(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }
}
