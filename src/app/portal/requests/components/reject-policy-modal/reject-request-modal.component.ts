import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, take } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-reject-request-modal',
  templateUrl: './reject-request-modal.component.html',
  styleUrls: ['./reject-request-modal.component.scss'],
  providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class RejectRequestModalComponent {
  request?: PopulatedRequestModel;
  form!: FormGroup;
  constructor(
    private _dialog: MatDialogRef<RejectRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: { request: PopulatedRequestModel },
    private _ui: UiService,
    private _requestService: RequestsService
  ) {
    this.request = this._data.request;
    this._initForm();
  }

  private _initForm() {
    this.form = this.form = new FormGroup({
      reason: new FormControl(null, [Validators.required]),
    });
  }

  rejectRequest(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to reject this request #${this.request?.serial}?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeRejectRequest();
      });
  }

  private _executeRejectRequest(): void {
    const { reason } = this.form.value;
    if (!reason) return;
    this._ui.showLoader();
    this._requestService
      .rejectRequest({ rejection_reason: reason }, this.request?._id ?? '')
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          'This request has been rejected successfully.'
        );
        this.close(true);
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }
}
