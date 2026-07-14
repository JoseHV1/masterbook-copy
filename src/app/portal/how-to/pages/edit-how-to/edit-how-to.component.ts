import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, switchMap, take } from 'rxjs';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';

@Component({
  selector: 'app-edit-how-to',
  templateUrl: './edit-how-to.component.html',
  styleUrls: ['./edit-how-to.component.scss'],
})
export class EditHowToComponent {
  howTo!: HowToModel;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _router: Router,
    private _howTo: HowToService
  ) {
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._howTo.getHowToBySerial(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: howTo => {
          this.howTo = howTo;
        },
        error: () => this._router.navigateByUrl('portal-admin/how-to'),
      });
  }

  goBack(): void {
    this._router.navigateByUrl('portal-admin/how-to');
  }
}
