import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolicyCategoryEnum } from '@app/shared/enums/policy-category.enum';
import { CreateRequestRequest } from '@app/shared/interfaces/requests/requests/create-request.request';
import { RequestsService } from '@app/shared/services/requests.service';
import { provideNgxMask } from 'ngx-mask';
import { finalize, take } from 'rxjs';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-cacellation-modal',
  templateUrl: './renewal-reinstalment-modal.component.html',
  styleUrls: ['./renewal-reinstalment-modal.component.scss'],
  providers: [
    MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
    provideNgxMask(),
  ],
})
export class RenewalReinstalmentModelComponent {
  policy?: PopulatedPolicyModel;
  form!: FormGroup;
  type?: PolicyCategoryEnum;

  constructor(
    private _dialog: MatDialogRef<RenewalReinstalmentModelComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy: PopulatedPolicyModel; type: PolicyCategoryEnum },
    private _request: RequestsService,
    private _ui: UiService
  ) {
    this.policy = this._data.policy;
    this.type = this._data.type;
    this.form = new FormGroup({
      insure_object: new FormControl(this.policy.insure_object, [
        Validators.required,
      ]),
      coverage: new FormControl(this.policy.coverage, [Validators.required]),
      additional_info: new FormControl('', Validators.required),
    });
  }

  renewalPolicy(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to renew your policy?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeRenewalPolicy();
      });
  }

  reinstallmentPolicy(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to reinstall your policy?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeReinstallmentPolicy();
      });
  }

  private _executeRenewalPolicy(): void {
    const req = {
      business_line_id: this._data.policy.business_line_id,
      refered_policy_id: this._data.policy._id,
      category: this.type,
      insure_object: this.form.value.insure_object,
      coverage: this.form.value.coverage,
      request_documents: this._data.policy.request_documents,
      additional_info: this.form.value.additional_info,
    } as CreateRequestRequest;

    this._ui.showLoader();
    this._request
      .createRequest(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Policy successfully renewal.');
        this.close(true);
      });
  }

  private _executeReinstallmentPolicy(): void {
    const req = {
      business_line_id: this._data.policy.business_line_id,
      refered_policy_id: this._data.policy._id,
      category: this.type,
      insure_object: this.form.value.insure_object,
      coverage: this.form.value.coverage,
      request_documents: this._data.policy.request_documents,
      additional_info: this.form.value.additional_info,
    } as CreateRequestRequest;

    this._ui.showLoader();
    this._request
      .createRequest(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(
          'The policy reinstallment request has been created successfully.'
        );
        this.close(true);
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }
}
