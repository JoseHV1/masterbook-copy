import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { AgencyWithTokenModel } from 'src/app/portal/leads/interfaces/agency-with-token.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TranslateService } from '@ngx-translate/core';

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
    private _t: TranslateService,
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
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.LOAD_AGENCIES_ERROR')),
      });
  }

  transfer(agency: AgencyWithTokenModel): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.TRANSFER_CONFIRM', { agency: agency.name }),
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
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.TRANSFER_SUCCESS'));
          this._router.navigateByUrl('portal-admin/leads/account');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.TRANSFER_ERROR')),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
