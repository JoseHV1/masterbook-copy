import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { LeadModel } from 'src/app/portal/leads/interfaces/lead.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { LeadStatusEnum } from 'src/app/portal/leads/enums/lead-status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-agency-lead-detail',
  templateUrl: './agency-lead-detail.component.html',
  styleUrls: ['./agency-lead-detail.component.scss'],
})
export class AgencyLeadDetailComponent {
  lead!: LeadModel;
  LeadStatusEnum = LeadStatusEnum;

  constructor(
    private _route: ActivatedRoute,
    private _leads: LeadsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _t: TranslateService,
  ) {
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => {
          const serial = params['serial'];
          if (!serial) throw new Error();
          return this._leads.getLeadBySerial(serial);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: lead => (this.lead = lead),
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.NOT_FOUND'));
          this._router.navigateByUrl('portal-admin/leads/agencies');
        },
      });
  }

  createAgencyUser(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.CREATE_AGENCY_CONFIRM'),
        type: UiModalTypeEnum.WARNING,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeCreateAgencyUser();
      });
  }

  private _executeCreateAgencyUser(): void {
    this._ui.showLoader();
    this._leads
      .convertLeadToAgency(this.lead.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this.lead.status = LeadStatusEnum.CONVERTED;
          this._ui
            .showInformationModal({
              title: this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.CREATE_AGENCY_SUCCESS_TITLE'),
              text: this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.CREATE_AGENCY_SUCCESS_TEXT'),
              type: UiModalTypeEnum.SUCCESS,
            })
            .subscribe();
        },
        error: () => {
          this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.LEADS.CREATE_AGENCY_ERROR'));
        },
      });
  }

  goBack(): void {
    this._location.back();
  }
}
