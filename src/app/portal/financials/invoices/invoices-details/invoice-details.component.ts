import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { finalize, forkJoin, switchMap, take, tap } from 'rxjs';
import { brokerRolesDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { PopulatedCommisionModel } from 'src/app/shared/interfaces/models/commisions.model';
import { PopulatedInvoiceModel } from 'src/app/shared/interfaces/models/invoice.model';
import { PaymentModel } from 'src/app/shared/models/payments.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
})
export class InvoiceDetailsComponent {
  invoice!: PopulatedInvoiceModel;
  payments!: PaymentModel[];
  comissions!: PopulatedCommisionModel[];
  isBroker = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private _invoices: InvoiceService,
    public _url: UrlService,
    private router: Router,
    private _auth: AuthService,
    private _location: Location,
    private _ui: UiService
  ) {
    this.isBroker = brokerRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );

    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadInvoice(id);
        }),
        switchMap(invoice => {
          return forkJoin([
            this._fetchDataCommissions(invoice._id),
            this._fetchDataPayments(invoice._id),
          ]);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => {
          this.router.navigateByUrl('portal/invoices');
        },
      });
  }

  navigateTo(url: string): void {
    this.router.navigate([`portal/invoices/${url}`]);
  }

  goBack(): void {
    this._location.back();
  }

  transformLabelInvoice(serial: string) {
    if (!serial) return '';
    if (serial.startsWith('INVA')) return 'Account Invoice';
    if (serial.startsWith('INVI')) return 'Insurer Invoice';
    return '';
  }

  _loadInvoice(serial: string) {
    return this._invoices
      .getInvoiceBySerial(serial)
      .pipe(tap((resp: PopulatedInvoiceModel) => (this.invoice = resp)));
  }

  _fetchDataPayments(id: string) {
    return this._invoices
      .getPaymentsByInvoiceId(id)
      .pipe(tap((resp: PaymentModel[]) => (this.payments = resp)));
  }

  _fetchDataCommissions(id: string) {
    return this._invoices
      .getCommissionsByInvoiceId(id)
      .pipe(tap((resp: PopulatedCommisionModel[]) => (this.comissions = resp)));
  }
}
