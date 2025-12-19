import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PolicyCategoryEnum } from '@app/shared/enums/policy-category.enum';
import { PopulatedPolicyTypeModel } from '@app/shared/interfaces/models/policy-type.model';
import { CreateRequestRequest } from '@app/shared/interfaces/requests/requests/create-request.request';
import { RequestsService } from '@app/shared/services/requests.service';
import { provideNgxMask } from 'ngx-mask';
import { finalize, take } from 'rxjs';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-cacellation-modal',
  templateUrl: './add-endorsements-modal.component.html',
  styleUrls: ['./add-endorsements-modal.component.scss'],
  providers: [
    MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
    provideNgxMask(),
  ],
})
export class AddEndorsementsModalComponent {
  policy?: PopulatedPolicyModel;
  cancellationDescription!: string;
  selectedEndorsements?: PopulatedPolicyTypeModel[];
  type?: PolicyCategoryEnum;
  currentStep = 1;
  form!: FormGroup;

  constructor(
    private _dialog: MatDialogRef<AddEndorsementsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy: PopulatedPolicyModel; type: PolicyCategoryEnum },
    private _request: RequestsService,
    private _ui: UiService
  ) {
    this.policy = this._data.policy;
    this.type = this._data.type;
    this.form = new FormGroup({
      coverage: new FormControl(this.policy.coverage, [Validators.required]),
      additional_info: new FormControl('', [Validators.required]),
      insure_object: new FormControl(this.policy.insure_object, [
        Validators.required,
      ]),
    });
  }

  addEndorsements(): void {
    if (this.currentStep === 1) {
      this.currentStep = 2;
      return;
    }

    this._ui
      .showConfirmationModal({
        text: `Are you sure you want add endorsements?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeAddEndorsements();
      });
  }

  private _executeAddEndorsements(): void {
    const req = {
      business_line_id: this._data.policy.business_line_id,
      refered_policy_id: this._data.policy._id,
      endorsement_ids: this.selectedEndorsements?.map(item => item._id),
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
          'The policy add endorsements request has been created successfully.'
        );
        this.close(true);
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }
}
