import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopulatedPaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { PaymentsService } from 'src/app/shared/services/payments.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { Location } from '@angular/common';
import { PopulatedPaymentModel } from 'src/app/shared/models/payments.model';
import { finalize, switchMap, take, tap } from 'rxjs';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/shared/services/auth.service';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { UiService } from '@app/shared/services/ui.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent {
  payment!: PopulatedPaymentTransactionModel;
  individual_payments!: PopulatedPaymentModel[];
  isOwner!: boolean;

  constructor(
    private _payments: PaymentsService,
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _location: Location,
    private dialog: MatDialog,
    private _auth: AuthService,
    private _ui: UiService
  ) {
    this.isOwner = ownersRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadPaymentTransactions(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._url.navigateTo('portal/payments'),
      });
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  private _loadPaymentTransactions(serial: string) {
    return this._payments.getPaymentTransactionBySerial(serial).pipe(
      tap((resp: PopulatedPaymentTransactionModel) => {
        this.payment = resp;
        if (resp?.payments) {
          this.individual_payments = resp.payments;
        }
      })
    );
  }

  goBack(): void {
    this._location.back();
  }
}
