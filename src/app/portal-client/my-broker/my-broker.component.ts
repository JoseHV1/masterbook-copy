import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '@app/shared/services/auth.service';
import { UserService } from '@app/shared/services/user.service';
import { UiService } from '@app/shared/services/ui.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-my-broker',
  templateUrl: './my-broker.component.html',
  styleUrls: ['./my-broker.component.scss'],
})
export class MyBrokerComponent implements OnInit {
  brokerId: string;
  broker: any;

  constructor(
    private _auth: AuthService,
    private _location: Location,
    private _ui: UiService,
    private _user: UserService
  ) {
    this.brokerId = this._auth.getAuth()?.user.broker_id ?? '';
  }

  ngOnInit() {
    this.fetchBrokerData();
  }

  goBack(): void {
    this._location.back();
  }

  fetchBrokerData() {
    this._ui.showLoader();
    this._user
      .getBrokerById(this.brokerId)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe((resp: any) => {
        this.broker = resp;
      });
  }
}
