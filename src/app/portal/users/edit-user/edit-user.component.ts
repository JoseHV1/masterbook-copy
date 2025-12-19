import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { finalize, switchMap, take } from 'rxjs';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-accounts',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-users.component.scss'],
})
export class EditAccountsComponent {
  user!: PopulatedBrokerModel;

  constructor(
    private activateRoute: ActivatedRoute,
    private _users: UserService,
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
          return this._users.getUserBySerial(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: user => (this.user = user),
        error: () => this._router.navigateByUrl('portal/users'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
