import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { AuthService } from '@app/shared/services/auth.service';
import { finalize, forkJoin, Observable, switchMap, take, tap } from 'rxjs';
import { BrokerStatusEnum } from 'src/app/shared/enums/broker-status.enum';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {
  user!: PopulatedBrokerModel;
  filterText = '';
  filtersActive = [{} as FilterActive];
  accounts: PopulatedAccount[] = [];
  requests: PopulatedRequestModel[] = [];
  policies: PopulatedPolicyModel[] = [];
  isOwner!: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _users: UserService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _accounts: AccountsService,
    private _requests: RequestsService,
    private _policies: PoliciesService,
    private dialog: MatDialog,
    private _auth: AuthService
  ) {
    this.isOwner = ownersRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadUser(id);
        }),
        switchMap(user => {
          this.filterText = `&broker_id=${user._id}`;
          return forkJoin([
            this._loadAccounts(),
            this._loadRequests(),
            this._loadPolicies(),
          ]);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal/users'),
      });
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  setStatus(user: PopulatedBrokerModel, event: MatSlideToggleChange): void {
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

  private _loadUser(serial: string): Observable<any> {
    return this._users
      .getUserBySerial(serial)
      .pipe(tap(resp => (this.user = resp)));
  }

  refreshAccounts(): void {
    this._ui.showLoader();
    this._loadAccounts()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadAccounts(): Observable<any> {
    return this._accounts
      .getAccounts(0, 5, this.filterText)
      .pipe(tap(resp => (this.accounts = resp.records)));
  }

  refreshRequests(): void {
    this._ui.showLoader();
    this._loadRequests()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadRequests(): Observable<any> {
    return this._requests
      .getRequests(0, 5, this.filterText)
      .pipe(tap(resp => (this.requests = resp.records)));
  }

  refreshPolicies(): void {
    this._ui.showLoader();
    this._loadPolicies()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadPolicies(): Observable<any> {
    return this._policies
      .getPolicies(0, 5, this.filterText)
      .pipe(tap(resp => (this.policies = resp.records)));
  }

  deleteUser(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this user?`,
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
    this._users
      .deleteUser(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('User deleted successfully');
        this._router.navigateByUrl('portal/users');
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

  goBack(): void {
    this._location.back();
  }
}
