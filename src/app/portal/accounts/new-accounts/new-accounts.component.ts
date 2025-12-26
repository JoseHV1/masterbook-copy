import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-new-accounts',
  templateUrl: './new-accounts.component.html',
  styleUrls: ['./new-accounts.component.scss'],
})
export class NewAccountsComponent {
  constructor(private _location: Location) {}

  goBack(): void {
    this._location.back();
  }
}
