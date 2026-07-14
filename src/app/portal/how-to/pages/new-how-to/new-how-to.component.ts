import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-how-to',
  templateUrl: './new-how-to.component.html',
  styleUrls: ['./new-how-to.component.scss'],
})
export class NewHowToComponent {
  constructor(private _router: Router) {}

  goBack(): void {
    this._router.navigateByUrl('portal-admin/how-to');
  }
}
