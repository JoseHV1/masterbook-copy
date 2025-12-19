import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take, switchMap, EMPTY } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { CommissionsService } from 'src/app/shared/services/commissions.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { CommissionStatusEnum } from 'src/app/shared/enums/commission-status.enum';
import { PopulatedCommisionModel } from 'src/app/shared/interfaces/models/commisions.model';

@Component({
  selector: 'app-commissions-table',
  templateUrl: './commissions-table.component.html',
  styleUrls: ['./commissions-table.component.scss'],
})
export class CommissionsTableComponent {
  @Output() refresh = new EventEmitter<void>();
  @Input() data: PopulatedCommisionModel[] = [];
  @Input() filtersActive: FilterActive[] = [];

  displayedColumns: string[] = [
    'serial',
    'insurer',
    'policy_number',
    'policy_type',
    'payment_date',
    'commission_to_pay',
    'agent',
    'agency',
    'status',
    'actions',
  ];

  private readonly STATUS_MAP: Record<string, StatusConfig> = {
    approved: {
      class: 'text-success',
      icon: 'check_circle',
      tooltip: 'Commission approved',
    },
    pending: {
      class: 'text-warning',
      icon: 'hourglass_empty',
      tooltip: 'Commission pending',
    },
    rejected: {
      class: 'text-danger',
      icon: 'cancel',
      tooltip: 'Commission rejected',
    },
  };

  constructor(
    private commissions: CommissionsService,
    private ui: UiService,
    public _url: UrlService
  ) {}

  getStatusConfig(status: string): StatusConfig {
    return (
      this.STATUS_MAP[status?.toLowerCase()] ?? {
        class: '',
        icon: 'help_outline',
        tooltip: 'Unknown status',
      }
    );
  }

  changeStatus(commissionId: string, currentStatus: string): void {
    const status = (currentStatus || '').toUpperCase();

    if (status !== CommissionStatusEnum.PENDING) return;

    this.ui
      .showConfirmationModal({ text: 'Approve this pending commission?' })
      .pipe(
        take(1),
        switchMap(approve => {
          if (approve) {
            return this.updateCommissionStatus(
              commissionId,
              CommissionStatusEnum.APPROVED
            );
          }
          return this.ui
            .showConfirmationModal({ text: 'Reject this pending commission?' })
            .pipe(
              take(1),
              switchMap(reject =>
                reject
                  ? this.updateCommissionStatus(
                      commissionId,
                      CommissionStatusEnum.REJECTED
                    )
                  : EMPTY
              )
            );
        })
      )
      .subscribe();
  }

  private updateCommissionStatus(
    commissionId: string,
    status: CommissionStatusEnum
  ) {
    return this.commissions.updateCommissionStatus(commissionId, status).pipe(
      take(1),
      tap(() => {
        this.ui.showAlertSuccess(
          `Commission ${status.toLowerCase()} successfully`
        );
        this.patchLocalCommissionStatus(commissionId, status);
      }),
      catchError(err => {
        this.ui.showAlertError('There was an error. Please try again.');
        return EMPTY;
      })
    );
  }

  private patchLocalCommissionStatus(
    commissionId: string,
    status: CommissionStatusEnum
  ) {
    const row = this.data.find(commission => commission._id === commissionId);
    if (row) row.status = status;
  }
}

interface StatusConfig {
  class: string;
  icon: string;
  tooltip: string;
}
