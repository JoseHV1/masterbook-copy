import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-edit-accounts',
  templateUrl: './edit-accounts.component.html',
  styleUrls: ['./edit-accounts.component.scss'],
})
export class EditAccountsComponent {
  account!: PopulatedAccount;

  constructor(
    private activateRoute: ActivatedRoute,
    private _accounts: AccountsService,
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
          return this._accounts.getAccount(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: account => (this.account = account),
        error: () => this._router.navigateByUrl('portal/accounts'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
