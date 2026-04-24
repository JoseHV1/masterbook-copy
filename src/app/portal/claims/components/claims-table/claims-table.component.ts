import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { finalize, take } from 'rxjs';
import { ClaimStatusEnum } from 'src/app/shared/enums/claim-status.enum';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedClaimModel } from 'src/app/shared/interfaces/models/claims.model';
import { ClaimModel } from 'src/app/shared/models/claim.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClaimsService } from 'src/app/shared/services/claims.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-claims-table',
  templateUrl: './claims-table.component.html',
  styleUrls: ['./claims-table.component.scss'],
})
export class ClaimsTableComponent implements OnChanges {
  @Output() refresh = new EventEmitter();
  @Input() data?: PopulatedClaimModel[];
  @Input() filtersActive: FilterActive[] = [];
  isInsured: boolean = false;

  displayedColumns: string[] = [
    'serial',
    'creation_date',
    'policy_number',
    'account',
    'date_of_event',
    'status',
    'amount',
    'created_by',
    'actions',
  ];

  constructor(
    public _url: UrlService,
    private _auth: AuthService,
    private _claim: ClaimsService,
    private _ui: UiService
  ) {
    const userRole = this._auth.getAuth()?.user.role;
    this.isInsured = !!userRole && [RolesEnum.INSURED].includes(userRole);
  }

  private readonly statusConfig = {
    [ClaimStatusEnum.APPROVED.toLowerCase()]: {
      textClass: 'text-success fw-bolder',
      iconClass: 'text-success',
      icon: 'check_circle',
      tooltip: 'Commission approved',
    },
    [ClaimStatusEnum.SUBMITTED.toLowerCase()]: {
      textClass: 'text-info fw-bolder',
      iconClass: 'text-info',
      icon: 'send',
      tooltip: 'Claim submitted',
    },
    [ClaimStatusEnum.UNDER_REVIEW.toLowerCase()]: {
      textClass: 'text-warning fw-bolder',
      iconClass: 'text-warning',
      icon: 'hourglass_empty',
      tooltip: 'Claim under review',
    },
    [ClaimStatusEnum.REJECTED.toLowerCase()]: {
      textClass: 'text-danger fw-bolder',
      iconClass: 'text-danger',
      icon: 'cancel',
      tooltip: 'Commission rejected',
    },
    [ClaimStatusEnum.CANCELLED.toLowerCase()]: {
      textClass: 'text-muted fw-bolder',
      iconClass: 'text-muted',
      icon: 'remove_circle',
      tooltip: 'Claim cancelled',
    },
  } as const;

  getStatusClass(status: string): string {
    return this.statusConfig[status?.toLowerCase()]?.textClass ?? '';
  }

  private readonly validTransitions: Record<
    ClaimStatusEnum,
    ClaimStatusEnum[]
  > = {
    [ClaimStatusEnum.SUBMITTED]: [ClaimStatusEnum.UNDER_REVIEW],
    [ClaimStatusEnum.UNDER_REVIEW]: [
      ClaimStatusEnum.APPROVED,
      ClaimStatusEnum.REJECTED,
      ClaimStatusEnum.CANCELLED,
    ],
    [ClaimStatusEnum.APPROVED]: [
      ClaimStatusEnum.REJECTED,
      ClaimStatusEnum.CANCELLED,
    ],
    [ClaimStatusEnum.REJECTED]: [
      ClaimStatusEnum.APPROVED,
      ClaimStatusEnum.CANCELLED,
    ],
    [ClaimStatusEnum.CANCELLED]: [
      ClaimStatusEnum.REJECTED,
      ClaimStatusEnum.APPROVED,
    ],
  };

  getAvailableNextStatuses(currentStatus: ClaimStatusEnum): ClaimStatusEnum[] {
    if (this.isInsured) {
      return currentStatus !== ClaimStatusEnum.CANCELLED
        ? [ClaimStatusEnum.CANCELLED]
        : [];
    }
    return this.validTransitions[currentStatus] ?? [];
  }

  private readonly icons: Record<ClaimStatusEnum, any> = {
    [ClaimStatusEnum.APPROVED]: {
      icon: 'check_circle',
      tooltip: 'Approve claim',
      colorClass: 'text-success',
    },
    [ClaimStatusEnum.REJECTED]: {
      icon: 'cancel',
      tooltip: 'Reject claim',
      colorClass: 'text-danger',
    },
    [ClaimStatusEnum.CANCELLED]: {
      icon: 'remove_circle',
      tooltip: 'Cancel claim',
      colorClass: 'text-muted',
    },
    [ClaimStatusEnum.UNDER_REVIEW]: {
      icon: 'hourglass_empty',
      tooltip: 'Send claim to review',
      colorClass: 'text-warning',
    },
    [ClaimStatusEnum.SUBMITTED]: {
      icon: 'send',
      tooltip: 'Submit claim',
      colorClass: 'text-info',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.data = this.data.map(claim => ({
        ...claim,
        actions: this.getActionIcons(claim.status as ClaimStatusEnum),
      }));
    }
  }

  getActionIcons(currentStatus: ClaimStatusEnum): {
    icon: string;
    tooltip: string;
    newStatus: ClaimStatusEnum;
    colorClass: string;
  }[] {
    const nextStatuses = this.getAvailableNextStatuses(currentStatus);

    return nextStatuses.map(status => ({
      ...this.icons[status],
      newStatus: status,
    }));
  }

  changeStatus(id: string, newStatus: ClaimStatusEnum): void {
    const claim = this.data?.find(c => c._id === id);
    if (!claim) return;

    const currentStatus = claim.status as ClaimStatusEnum;
    const nextStatuses = this.getAvailableNextStatuses(currentStatus);

    if (nextStatuses.includes(newStatus)) {
      this._ui.showLoader();
      this._claim
        .changeStatus(id, newStatus)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this._openSuccessModal(resp);
        });
    }
  }

  private _openSuccessModal(claim: ClaimModel) {
    const message = `The status claim {{link}} has been updated successfully`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: claim.serial,
          url: ['/portal/claims', claim.serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          window.location.reload();
        }
      });
  }

  deleteClaim(_id: string): void {
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
    this._claim
      .deleteClaim(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Claim deleted successfully');
        this.refresh.emit();
      });
  }
}
