import { Component, Inject } from '@angular/core';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateRequestRequest } from '@app/shared/interfaces/requests/requests/create-request.request';
import { RequestsService } from '@app/shared/services/requests.service';
import { finalize, take } from 'rxjs';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-cacellation-modal',
  templateUrl: './cancellation-policy-modal.component.html',
  styleUrls: ['./cancellation-policy-modal.component.scss'],
  providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class CancellationModalComponent {
  policy?: PopulatedPolicyModel;
  cancellationDescription!: string;

  constructor(
    private _dialog: MatDialogRef<CancellationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy: PopulatedPolicyModel },
    private _request: RequestsService,
    private _ui: UiService
  ) {
    this.policy = this._data.policy;
  }

  cancellationPolicy(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to cancel your policy?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeCancellationPolicy();
      });
  }

  private _executeCancellationPolicy(): void {
    const req = {
      business_line_id: this._data.policy.business_line_id,
      refered_policy_id: this._data.policy._id,
      category: 'CANCELLATION',
      insure_object: this._data.policy.insure_object,
      coverage: this._data.policy.coverage,
      request_documents: this._data.policy.request_documents,
      additional_info: this.cancellationDescription,
    } as CreateRequestRequest;

    this._ui.showLoader();
    this._request
      .createRequest(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          'The policy cancellation request has been created successfully.'
        );
        this.close(true);
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }
}
