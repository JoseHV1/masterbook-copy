import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { finalize, take } from 'rxjs';
import { BrokerStatusEnum } from 'src/app/shared/enums/broker-status.enum';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
})
export class UsersTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  @Input() data?: PopulatedBrokerModel[];
  @Input() filtersActive: FilterActive[] = [];
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'role',
    'email',
    'phone',
    'status',
    'created_at',
    'last_login_at',
    'actions',
  ];

  constructor(
    private _users: UserService,
    private _ui: UiService,
    public _url: UrlService
  ) {}

  openUpdateStatusConfirmationModal(
    user: PopulatedBrokerModel,
    event: MatSlideToggleChange
  ): void {
    const previousStatus = user.status;
    const status = event.checked
      ? BrokerStatusEnum.ACTIVE
      : BrokerStatusEnum.INACTIVE;

    const message =
      status === BrokerStatusEnum.ACTIVE
        ? `an additional recharge`
        : `a reduction`;
    let userCost = 0;
    switch (user.user?.role) {
      case RolesEnum.AGENCY_ADMINISTRATOR:
        userCost = 5;
        break;
      case RolesEnum.AGENCY_BROKER:
        userCost = 3;
        break;
      default:
        break;
    }
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to update this user? This action will generate ${message} of $${userCost} per month`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this.updateStatusBroker(user, event);
        } else {
          event.source.checked = previousStatus === BrokerStatusEnum.ACTIVE;
          user.status = previousStatus;
        }
      });
  }

  updateStatusBroker(
    user: PopulatedBrokerModel,
    event: MatSlideToggleChange
  ): void {
    const status = event.checked
      ? BrokerStatusEnum.ACTIVE
      : BrokerStatusEnum.INACTIVE;

    this._ui.showLoader();
    this._users
      .setUserStatus(user._id, { status })
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(
            "The user's status has been successfully updated"
          );
          user.status = status;
        },
        error: () => {
          this._ui.showAlertError('Failed to update user status');
          event.source.checked = user.status === BrokerStatusEnum.ACTIVE;
        },
      });
  }

  resendInvitation(user: PopulatedBrokerModel): void {
    this._ui.showLoader();
    this._users
      .resendInvitationEmail(user._id)
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

  deleteUser(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this user?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._users
      .deleteUser(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('User deleted successfully');
        this.refresh.emit();
      });
  }
}
