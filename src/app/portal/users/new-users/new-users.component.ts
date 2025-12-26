import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.scss'],
})
export class NewUsersComponent {
  constructor(private _location: Location) {}

  goBack(): void {
    this._location.back();
  }
}
