import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { finalize, take } from 'rxjs';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { isInvalid } from '../../../../shared/helpers/is-invalid.helper';
import { hasError } from '../../../../shared/helpers/has-error.helper.ts';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addZero } from '../../../../shared/helpers/add-zero';
import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { CreateRequestRequest } from 'src/app/shared/interfaces/requests/requests/create-request.request';
import { RequestModel } from 'src/app/shared/interfaces/models/request.model';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateRequestRequest } from 'src/app/shared/interfaces/requests/requests/update-request.request';

@Component({
  selector: 'app-form-requests-from-policy',
  templateUrl: './form-requests-from-policy.component.html',
  styleUrls: ['./form-requests-from-policy.component.scss'],
})
export class FormRequestsFromPolicyComponent implements OnInit {
  @Input() data!: RequestFromPolicyFormData;
  @Output() back: EventEmitter<void> = new EventEmitter();

  form!: FormGroup;

  isInvalid = isInvalid;
  hasError = hasError;
  addZero = addZero;

  constructor(
    private _ui: UiService,
    private _request: RequestsService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.form = new FormGroup({
      insure_object: new FormControl(null, [Validators.required]),
      coverage: new FormControl(null, [Validators.required]),
      request_document: new FormControl(null, [Validators.required]),
      additional_info: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      coverage: this.data.policy.coverage,
      insure_object: this.data.policy.insure_object,
      // request_document: [this.data.policy.request_document], //refactoring
      additional_info: this.data.policy.description,
    });
  }

  showFormsListModal(): void {
    //refactoring
  }

  openConfirmationModal(action: string) {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to ${
          action == 'edit' ? 'edited' : 'saved'
        } this request?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this._send();
        }
      });
  }

  private _send() {
    if (this.data.action == 'edit') {
      this._editData();
      return;
    }

    this._saveData();
  }

  private _saveData() {
    const req = {
      ...this.form.value,
      category: this.data.category,
      refered_policy_id: this.data.policy._id,
    } as CreateRequestRequest;

    this._ui.showLoader();
    this._request
      .createRequest(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(request => {
        this.form.reset();
        this._openSuccessModal(request, 'created');
      });
  }

  private _editData() {
    const req = {
      ...this.form.value,
      coverage: parseFloat(parseFloat(this.form.value.coverage).toFixed(2)),
    } as UpdateRequestRequest;

    this._ui.showLoader();
    this._request
      .editRequest(req, this.data.policy._id.toString())
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(request => {
        this.form.reset();
        this._openSuccessModal(request, 'updated');
      });
  }

  private _openSuccessModal(
    request: RequestModel,
    action: 'created' | 'updated'
  ) {
    const message = `The request {{link}} has been ${action} successfully.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: `#${request.serial}`,
          url: ['/portal/requests', request.serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/requests']);
        }
      });
  }

  backStep() {
    this.back.emit();
  }
}

export interface RequestFromPolicyFormData {
  category: PolicyCategoryEnum;
  policy: PopulatedPolicyModel;
  action: 'edit' | 'create';
}
