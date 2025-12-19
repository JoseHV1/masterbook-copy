import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { finalize, take } from 'rxjs';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { SetAgentModalComponent } from '../set-agent-modal/set-agent-modal.component';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { CancellationModalComponent } from '../cacellation-policy-modal/cancellation-policy-modal.component';
import { RenewalReinstalmentModelComponent } from '../renewal-reinstalment-modal/renewal-reinstalment-modal.component';
import { PolicyCategoryEnum } from '@app/shared/enums/policy-category.enum';
import { PolicyTypeEnum } from '@app/shared/enums/policy-type.enum';
import { PolicyStatus } from '@app/shared/enums/policy-status.enum';
import { AddEndorsementsModalComponent } from '../add-endorsements-modal/add-endorsements-modal.component';

@Component({
  selector: 'app-policies-table',
  templateUrl: './policies-table.component.html',
  styleUrls: ['./policies-table.component.scss'],
})
export class PoliciesTableComponent implements OnInit {
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Output() selectChange: EventEmitter<PopulatedPolicyModel> =
    new EventEmitter();
  @Input() data?: PopulatedPolicyModel[];
  @Input() filtersActive: FilterActive[] = [];
  @Input() mode: PoliciesTableMode = PoliciesTableMode.VIEW;
  PoliciesTableMode = PoliciesTableMode;
  displayedColumns: string[] = [
    'serial',
    'created_at',
    'policy_number',
    'type',
    'account_name',
    'agent_name',
    'insurance_company',
    'coverage',
    'policy_prime',
    'deductible',
    'status',
    'category',
    'effective_date',
    'expires_date',
  ];

  @Input() urlDetails?: string;
  isAdmin = false;
  policyCategoryEnumType = PolicyCategoryEnum;
  policyStatusEnum = PolicyStatus;
  constructor(
    private _policies: PoliciesService,
    private _ui: UiService,
    public url: UrlService,
    private _auth: AuthService,
    private _dialog: MatDialog,
    private _location: Location
  ) {
    this.isAdmin = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role as RolesEnum
    );
  }

  ngOnInit(): void {
    const path = this._location.path();

    if (!this.urlDetails) {
      this.urlDetails = path.includes('/portal-client')
        ? '/portal-client/policies'
        : '/portal/policies';
    }

    this.displayedColumns.push('actions');
  }

  deletePolicy(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this policy?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._policies
      .deletePolicy(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Policy deleted successfully');
        this.refresh.emit();
      });
  }

  selectPolicy(policy: PopulatedPolicyModel): void {
    if (this.mode !== PoliciesTableMode.SELECT) return;
    this.selectChange.emit(policy);
  }

  openSetAgentModal(policy: PopulatedPolicyModel): void {
    this._dialog
      .open(SetAgentModalComponent, {
        data: { policy },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(resp => {
        if (resp) this.refresh.emit();
      });
  }

  openCancelPolicyModal(policy: PopulatedPolicyModel): void {
    this._dialog
      .open(CancellationModalComponent, {
        data: { policy },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }

  openRenewalReinstalmentModal(
    policy: PopulatedPolicyModel,
    type: PolicyCategoryEnum
  ): void {
    this._dialog
      .open(RenewalReinstalmentModelComponent, {
        data: { policy, type },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }

  openAddEndorsementsModal(
    policy: PopulatedPolicyModel,
    type: PolicyCategoryEnum
  ): void {
    this._dialog
      .open(AddEndorsementsModalComponent, {
        data: { policy, type },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }
}

export enum PoliciesTableMode {
  VIEW = 'VIEW',
  SELECT = 'SELECT',
}
