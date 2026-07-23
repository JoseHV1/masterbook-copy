import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { BreadcrumbOverrideService } from 'src/app/shared/services/breadcrumb-override.service';

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
    private _location: Location,
    private _breadcrumbOverride: BreadcrumbOverrideService
  ) {
    this._ui.showLoader();
    let accountId = '';
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          accountId = id;
          return this._accounts.getAccount(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: account => {
          this.account = account;
          if (account.serial) this._breadcrumbOverride.setLabel(accountId, account.serial);
        },
        error: () => this._router.navigateByUrl('portal/accounts'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
