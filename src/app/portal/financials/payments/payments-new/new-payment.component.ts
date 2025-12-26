import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EMPTY, finalize, switchMap, take, tap } from 'rxjs';
import { PaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { PaymentsService } from 'src/app/shared/services/payments.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss'],
})
export class NewPaymentComponent {
  payment!: PaymentTransactionModel;

  constructor(
    private activateRoute: ActivatedRoute,
    private _payments: PaymentsService,
    private _ui: UiService,
    private _location: Location
  ) {
    this._ui.showLoader();

    this.activateRoute.queryParams
      .pipe(
        take(1),
        switchMap(query => {
          const id = query['payment_id'];
          if (id) return this._payments.getPaymentTransaction(id);
          return EMPTY;
        }),
        tap(),
        finalize(() => {
          this._ui.hideLoader();
        })
      )
      .subscribe({
        next: payment => {
          this.payment = payment;
        },
      });
  }

  goBack(): void {
    this._location.back();
  }
}
