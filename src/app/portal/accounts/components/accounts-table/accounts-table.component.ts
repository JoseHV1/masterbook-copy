import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { AccountStatusEnum } from 'src/app/shared/enums/account-status.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.scss'],
})
export class AccountsTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  @Input() data?: PopulatedAccount[];
  @Input() filtersActive: FilterActive[] = [];
  displayedColumns: string[] = [
    'id',
    'account_name',
    'first_name',
    'last_name',
    'email',
    'broker',
    'phone',
    'status',
    'created_at',
    'last_login_at',
    'actions',
  ];

  constructor(
    private _accounts: AccountsService,
    private _ui: UiService,
    public _url: UrlService
  ) {}

  setStatus(account: PopulatedAccount, event: MatSlideToggleChange): void {
    const status = event.checked
      ? AccountStatusEnum.ACTIVE
      : AccountStatusEnum.INACTIVE;

    this._ui.showLoader();
    this._accounts
      .setAccountStatus(account._id, { status })
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(
            "The account's status has been successfully updated"
          );
          account.status = status;
        },
        error: () => {
          this._ui.showAlertError('Failed to update account status');
          event.source.checked = account.status === AccountStatusEnum.ACTIVE;
        },
      });
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

  getStatusClass(status: string | null): string {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      default:
        return 'status-inactive';
    }
  }

  deleteAccount(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this account?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._accounts
      .deleteAccount(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Account deleted successfully');
        this.refresh.emit();
      });
  }
}
