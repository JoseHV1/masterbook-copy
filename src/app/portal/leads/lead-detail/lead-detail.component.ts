import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { LeadModel } from '../interfaces/lead.model';
import { LeadsService } from '../services/leads.service';
import { LeadStatusEnum } from '../enums/lead-status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss'],
})
export class LeadDetailComponent {
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
          this._ui.showAlertError(this._t.instant('PORTAL.LEADS.NOT_FOUND'));
          this._router.navigateByUrl('portal/leads');
        },
      });
  }

  convertToAccount(): void {
    this._router.navigate(['/portal/leads', this.lead.serial, 'convert']);
  }

  rejectLead(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.LEADS.CONFIRM_REJECT'),
        type: UiModalTypeEnum.WARNING,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeReject();
      });
  }

  private _executeReject(): void {
    this._ui.showLoader();
    this._leads
      .rejectLead(this.lead.serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.LEADS.REJECTED'));
          this.lead.status = LeadStatusEnum.REJECTED;
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.LEADS.REJECT_ERROR')),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
