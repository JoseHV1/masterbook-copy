import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PAYMENT_STATUS } from 'src/app/shared/enums/payment-status';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly maxAttempts = 5;
  private readonly retryDelayMs = 2000;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this._pollPaymentStatus(0);
  }

  private _pollPaymentStatus(attempt: number): void {
    this._auth
      .refreshAuth()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        const paid = user.agency?.payment_status === PAYMENT_STATUS.PAYED;
        if (!paid && attempt < this.maxAttempts) {
          setTimeout(
            () => this._pollPaymentStatus(attempt + 1),
            this.retryDelayMs
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
