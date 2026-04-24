import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { LeadModel } from '../interfaces/lead.model';
import { LeadsService } from '../services/leads.service';
import { LeadStatusEnum } from '../enums/lead-status.enum';

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
          this._ui.showAlertError('Lead not found.');
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
        text: 'Are you sure you want to reject this lead?',
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
          this._ui.showAlertSuccess('Lead rejected successfully.');
          this.lead.status = LeadStatusEnum.REJECTED;
        },
        error: () => this._ui.showAlertError('Could not reject the lead. Please try again.'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
