import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { LeadModel } from 'src/app/portal/leads/interfaces/lead.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { LeadStatusEnum } from 'src/app/portal/leads/enums/lead-status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-lead-detail',
  templateUrl: './admin-lead-detail.component.html',
  styleUrls: ['./admin-lead-detail.component.scss'],
})
export class AdminLeadDetailComponent {
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
          this._router.navigateByUrl('portal-admin/leads');
        },
      });
  }

  transferLead(): void {
    this._router.navigate(['portal-admin', 'leads', 'account', this.lead.serial, 'transfer']);
  }

  goBack(): void {
    this._location.back();
  }
}
