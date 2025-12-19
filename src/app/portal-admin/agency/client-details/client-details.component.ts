import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '@app/shared/services/admin-panel.service';
import { finalize, switchMap, take, tap } from 'rxjs';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent {
  agency!: any;

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _adminPanel: AdminPanelService
  ) {
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadAgencyDetails(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal-admin/agencies'),
      });
  }

  private _loadAgencyDetails(serial: string) {
    return this._adminPanel
      .getClient(serial)
      .pipe(tap(resp => (this.agency = resp)));
  }

  goBack(): void {
    this._location.back();
  }
}
