import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take, tap } from 'rxjs';

import { ClaimsService } from 'src/app/shared/services/claims.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-edit-accounts',
  templateUrl: './edit-claims.component.html',
  styleUrls: ['./edit-claims.component.scss'],
})
export class EditClaimsComponent {
  claim!: any;
  loading = true;

  constructor(
    private activateRoute: ActivatedRoute,
    private _claims: ClaimsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location
  ) {
    this._ui.showLoader();

    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadClaim(id);
        }),
        finalize(() => {
          this.loading = false;
          this._ui.hideLoader();
        })
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal/claims'),
      });
  }

  _loadClaim(serial: string) {
    return this._claims
      .getClaimBySerial(serial)
      .pipe(tap(resp => (this.claim = resp)));
  }

  goBack(): void {
    this._location.back();
  }
}
