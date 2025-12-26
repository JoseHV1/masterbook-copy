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
  total_accounts: number;
  total_quotes: number;
  policies_actives: number;
  total_near_policies_one_month: number;

  revenue_mtd: number; // money
  revenue_ytd: number; // money
}>;

type KpiKey =
  | 'revenue_mtd'
  | 'revenue_ytd'
  | 'policies_actives'
  | 'total_near_policies_one_month'
  | 'total_quotes'
  | 'total_accounts';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
})
export class SummaryCardsComponent implements OnChanges, OnDestroy {
  @Input() dashboardTotals: DashboardTotals | null = null;

  animatedTotals: Record<KpiKey, number> = {
    revenue_mtd: 0,
    revenue_ytd: 0,
    policies_actives: 0,
    total_near_policies_one_month: 0,
    total_quotes: 0,
    total_accounts: 0,
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

      // looks cleaner when 0 -> set immediately
      if (!finalValue) {
        this.animatedTotals[key] = 0;
        return;
      }

      // smoother + consistent timing across small/large numbers
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

  formatMoney(value: number, currency = 'CAD'): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value ?? 0);
  }
}
