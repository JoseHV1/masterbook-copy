import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { AgencyWithTokenModel } from 'src/app/portal/leads/interfaces/agency-with-token.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-transfer-lead',
  templateUrl: './transfer-lead.component.html',
  styleUrls: ['./transfer-lead.component.scss'],
})
export class TransferLeadComponent {
  agencies: AgencyWithTokenModel[] = [];
  private serial = '';

  displayedColumns: string[] = ['logo', 'name', 'serial', 'actions'];

  constructor(
    private _route: ActivatedRoute,
    private _leads: LeadsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
  ) {
    this.serial = this._route.snapshot.params['serial'] ?? '';
    this._loadAgencies();
  }

  private _loadAgencies(): void {
    this._ui.showLoader();
    this._leads
      .getAgenciesWithToken()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: agencies => (this.agencies = agencies),
        error: () => this._ui.showAlertError('Could not load agencies. Please try again.'),
      });
  }

  transfer(agency: AgencyWithTokenModel): void {
    this._ui
      .showConfirmationModal({
        text: `Transfer this lead to ${agency.name}?`,
        type: UiModalTypeEnum.WARNING,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeTransfer(agency);
      });
  }

  private _executeTransfer(agency: AgencyWithTokenModel): void {
    this._ui.showLoader();
    this._leads
      .transferLead(this.serial, { agency_id: agency._id })
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess('Lead transferred successfully.');
          this._router.navigateByUrl('portal-admin/leads/account');
        },
        error: () => this._ui.showAlertError('Could not transfer the lead. Please try again.'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
