import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-how-to',
  templateUrl: './new-how-to.component.html',
  styleUrls: ['./new-how-to.component.scss'],
})
export class NewHowToComponent {
  constructor(private _location: Location) {}

  goBack(): void {
    this._location.back();
  }
}
