import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiService } from '@app/shared/services/ui.service';
import { finalize } from 'rxjs';
import { PopulatedCommisionModel } from 'src/app/shared/interfaces/models/commisions.model';
import { HttpResponseModel } from 'src/app/shared/models/response/http.response.model';
import { CommissionsService } from 'src/app/shared/services/commissions.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-commission-details',
  templateUrl: './commission-detail.component.html',
  styleUrls: ['./commission-detail.component.scss'],
})
export class CommissionDetailsComponent {
  commission!: PopulatedCommisionModel;

  constructor(
    private _commissions: CommissionsService,
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _location: Location,
    private _ui: UiService
  ) {
    this.activateRoute.params.subscribe((params: any) => {
      this._ui.showLoader();
      this._commissions
        .getCommissionById(params.id)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe({
          next: (resp: PopulatedCommisionModel) => {
            this.commission = resp;
          },
          error: error => {
            console.error('Error fetching account details', error);
            this._ui.showAlertError('Error loading commission');
          },
        });
    });
  }

  goBack(): void {
    this._location.back();
  }

  getStatusClass(status: string): string {
    const baseClasses = 'badge rounded-pill fw-medium px-3 py-2';

    const colorMap: Record<string, string> = {
      approved: 'bg-success-subtle text-success',
      rejected: 'bg-danger-subtle text-danger',
      pending: 'bg-warning-subtle text-warning',
    };

    return `${baseClasses} ${
      colorMap[(status || '').toLowerCase()] ||
      'bg-secondary-subtle text-secondary'
    }`;
  }
}
