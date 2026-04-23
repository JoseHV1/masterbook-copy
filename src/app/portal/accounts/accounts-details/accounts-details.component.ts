import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { PopulatedClaimModel } from '@app/shared/interfaces/models/claims.model';
import { PaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { AuthService } from '@app/shared/services/auth.service';
import { ClaimsService } from '@app/shared/services/claims.service';
import { PaymentsService } from '@app/shared/services/payments.service';
import { finalize, forkJoin, Observable, switchMap, take, tap } from 'rxjs';
import { AccountStatusEnum } from 'src/app/shared/enums/account-status.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { PopulatedInvoiceModel } from '@app/shared/interfaces/models/invoice.model';
import { InvoiceService } from '@app/shared/services/invoice.service';
import { PaginatedResponse } from '@app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './accounts-details.component.html',
  styleUrls: ['./accounts-details.component.scss'],
})
export class AccountsDetailsComponent {
  account!: PopulatedAccount;
  filterText = '';
  filtersActive = [{} as FilterActive];
  requests: PaginatedResponse<PopulatedRequestModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  policies: PaginatedResponse<PopulatedPolicyModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  claims: PaginatedResponse<PopulatedClaimModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  payments: PaginatedResponse<PaymentTransactionModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  invoices: PaginatedResponse<PopulatedInvoiceModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };
  isOwner!: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _accounts: AccountsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _requests: RequestsService,
    private _policies: PoliciesService,
    private _claims: ClaimsService,
    private _payments: PaymentsService,
    private _invoices: InvoiceService,
    private dialog: MatDialog,
    private _auth: AuthService
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
          return this._loadAccount(id);
        }),
        switchMap(acc => {
          this.filterText = `&client_id=${acc._id}`;
          return forkJoin([
            this._loadPolicies(),
            this._loadRequests(),
            this._loadClaims(),
            this._loadPayments(),
            this._loadInvoices(),
          ]);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal/accounts'),
      });
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  setStatus(event: MatSlideToggleChange): void {
    const status = event.checked
      ? AccountStatusEnum.ACTIVE
      : AccountStatusEnum.INACTIVE;

    this._ui.showLoader();
    this._accounts
      .setAccountStatus(this.account._id, { status })
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(
            "The account's status has been successfully updated"
          );
          this.account.status = status;
        },
        error: () => {
          this._ui.showAlertError('Failed to update account status');
          event.source.checked =
            this.account.status === AccountStatusEnum.ACTIVE;
        },
      });
  }

  private _loadAccount(id: string): Observable<any> {
    return this._accounts.getAccountBySerial(id).pipe(
      tap(resp => {
        this.account = resp;
      })
    );
  }

  onPageChange(event: PageEvent, type: string) {
    this._ui.showLoader();
    switch (type) {
      case 'payments':
        this._loadPayments(event.pageIndex)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe();
        break;
      case 'invoices':
        this._loadInvoices(event.pageIndex)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe();
        break;
      case 'claims':
        this._loadClaims(event.pageIndex)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe();
        break;
      case 'requests':
        this._loadRequests(event.pageIndex)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe();
        break;
      case 'policies':
        this._loadPolicies(event.pageIndex)
          .pipe(finalize(() => this._ui.hideLoader()))
          .subscribe();
        break;
    }
  }

  refreshRequests(): void {
    this._ui.showLoader();
    this._loadRequests()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadRequests(
    page: number = 0,
    pageSize: number = 5
  ): Observable<any> {
    return this._requests
      .getRequests(page, pageSize, this.filterText)
      .pipe(tap(resp => (this.requests = resp)));
  }

  refreshPolicies(): void {
    this._ui.showLoader();
    this._loadPolicies()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadPolicies(
    page: number = 0,
    pageSize: number = 5
  ): Observable<any> {
    return this._policies
      .getPolicies(page, pageSize, this.filterText)
      .pipe(tap(resp => (this.policies = resp)));
  }

  refreshClaims(): void {
    this._ui.showLoader();
    this._loadClaims()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadClaims(page: number = 0, pageSize: number = 5): Observable<any> {
    return this._claims
      .getClaims(page, pageSize, this.filterText)
      .pipe(tap(resp => (this.claims = resp)));
  }

  refreshPayments(): void {
    this._ui.showLoader();
    this._loadPayments()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadPayments(
    page: number = 0,
    pageSize: number = 5
  ): Observable<any> {
    return this._payments
      .getPaymentTransactions(page, pageSize, this.filterText)
      .pipe(tap(resp => (this.payments = resp)));
  }

  refreshInvoices(): void {
    this._ui.showLoader();
    this._loadInvoices()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadInvoices(
    page: number = 0,
    pageSize: number = 5
  ): Observable<any> {
    return this._invoices
      .getInvoices(page, pageSize, this.filterText)
      .pipe(tap(resp => (this.invoices = resp)));
  }

  resendInvitation(account: PopulatedAccount): void {
    this._ui.showLoader();
    this._accounts
      .resendInvitationEmail(account._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          'The invitation email has been resent successfully'
        );
      });
  }

  deleteAccount(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this account?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this._executeDelete(_id);
        }
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._accounts
      .deleteAccount(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Account deleted successfully');
        this._router.navigateByUrl('portal/accounts');
      });
  }

  goBack(): void {
    this._location.back();
  }
}
